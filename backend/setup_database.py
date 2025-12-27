#!/usr/bin/env python3
"""
Database setup script for Clothing Tracker.
This script helps you:
1. Create the PostgreSQL database if it doesn't exist
2. Set up the .env file with your DATABASE_URL
3. Test the database connection
"""

import os
import sys
import subprocess
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse, urlunparse

def check_postgres_running():
    """Check if PostgreSQL is running."""
    try:
        # Try to connect to the default postgres database
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            database="postgres",
            user=os.getenv("USER", "postgres")
        )
        conn.close()
        return True
    except psycopg2.OperationalError:
        return False

def get_postgres_user():
    """Get the PostgreSQL username."""
    # Try common usernames
    common_users = [os.getenv("USER"), "postgres", "chrislovejoy"]
    for user in common_users:
        if user:
            try:
                conn = psycopg2.connect(
                    host="localhost",
                    port=5432,
                    database="postgres",
                    user=user
                )
                conn.close()
                return user
            except psycopg2.OperationalError:
                continue
    return None

def create_database(db_name, user, password=None):
    """Create the database if it doesn't exist."""
    try:
        # Connect to postgres database to create our database
        if password:
            conn = psycopg2.connect(
                host="localhost",
                port=5432,
                database="postgres",
                user=user,
                password=password
            )
        else:
            conn = psycopg2.connect(
                host="localhost",
                port=5432,
                database="postgres",
                user=user
            )
        
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (db_name,)
        )
        exists = cursor.fetchone()
        
        if exists:
            print(f"✓ Database '{db_name}' already exists")
        else:
            # Create database
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(db_name)
                )
            )
            print(f"✓ Created database '{db_name}'")
        
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"✗ Error creating database: {e}")
        return False

def test_connection(database_url):
    """Test the database connection."""
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        cursor.close()
        conn.close()
        print(f"✓ Successfully connected to database")
        print(f"  PostgreSQL version: {version[0][:50]}...")
        return True
    except psycopg2.Error as e:
        print(f"✗ Connection test failed: {e}")
        return False

def create_env_file(database_url, aws_access_key="", aws_secret_key="", aws_region="us-east-1", aws_bucket="", secret_key="dev-secret-key-change-in-production"):
    """Create or update the .env file."""
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    
    env_content = f"""# Database Configuration
DATABASE_URL={database_url}

# AWS S3 Configuration (optional for local development)
AWS_ACCESS_KEY_ID={aws_access_key}
AWS_SECRET_ACCESS_KEY={aws_secret_key}
AWS_REGION={aws_region}
AWS_S3_BUCKET={aws_bucket}

# Secret Key (change in production)
SECRET_KEY={secret_key}
"""
    
    if os.path.exists(env_path):
        print(f"⚠ .env file already exists at {env_path}")
        response = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if response != 'y':
            print("Keeping existing .env file. You may need to update DATABASE_URL manually.")
            return False
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print(f"✓ Created .env file at {env_path}")
    return True

def main():
    print("=" * 60)
    print("Clothing Tracker - Database Setup")
    print("=" * 60)
    print()
    
    # Check if PostgreSQL is running
    print("1. Checking if PostgreSQL is running...")
    if not check_postgres_running():
        print("✗ PostgreSQL doesn't appear to be running.")
        print("\nPlease start PostgreSQL first:")
        print("  brew services start postgresql@15  # or your version")
        print("  # or")
        print("  pg_ctl -D /usr/local/var/postgres start")
        sys.exit(1)
    print("✓ PostgreSQL is running")
    print()
    
    # Get database credentials
    print("2. Database Configuration")
    print("-" * 60)
    
    # Try to detect username
    detected_user = get_postgres_user()
    if detected_user:
        print(f"Detected PostgreSQL user: {detected_user}")
        use_detected = input(f"Use '{detected_user}'? (Y/n): ").strip().lower()
        if use_detected != 'n':
            user = detected_user
        else:
            user = input("Enter PostgreSQL username: ").strip()
    else:
        user = input("Enter PostgreSQL username: ").strip()
    
    password = input("Enter PostgreSQL password (leave empty if no password): ").strip()
    port = input("Enter PostgreSQL port (default: 5432): ").strip() or "5432"
    db_name = input("Enter database name (default: clothing_tracker): ").strip() or "clothing_tracker"
    
    print()
    
    # Create database
    print("3. Creating database...")
    if not create_database(db_name, user, password if password else None):
        print("\nYou may need to create the database manually:")
        print(f"  createdb {db_name}")
        print("  # or")
        print(f"  psql postgres -c 'CREATE DATABASE {db_name};'")
        sys.exit(1)
    print()
    
    # Build DATABASE_URL
    if password:
        database_url = f"postgresql://{user}:{password}@localhost:{port}/{db_name}"
    else:
        database_url = f"postgresql://{user}@localhost:{port}/{db_name}"
    
    # Test connection
    print("4. Testing database connection...")
    if not test_connection(database_url):
        print("\nConnection test failed. Please check your credentials.")
        sys.exit(1)
    print()
    
    # Create .env file
    print("5. Creating .env file...")
    create_env_file(database_url)
    print()
    
    print("=" * 60)
    print("✓ Database setup complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. The database tables will be created automatically when you run the app")
    print("2. Start the backend server:")
    print("   cd backend")
    print("   source venv/bin/activate")
    print("   python run.py")
    print()
    print("Your DATABASE_URL has been saved to backend/.env")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        sys.exit(1)

