# Clothing Tracker App - Project Plan

## Overview
A web application for tracking personal clothing items, designed to help users (you and your wife) avoid purchasing duplicate or similar items by providing intelligent similarity matching and comprehensive inventory management.

## Core Objectives
- Prevent duplicate purchases by identifying similar items already owned
- Maintain a searchable inventory of all clothing items
- Provide visual and descriptive search capabilities
- Automatically extract and store metadata for better organization

---

## Core Features

### 1. Item Management

#### 1.1 Add Clothing Items
- **Photo Upload**: Upload one or multiple photos of a clothing item
- **Bulk Import**: Option to add multiple items at once
- **Item Details Form**:
  - Name/Description (optional, auto-generated if not provided)
  - Category (e.g., Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories)
  - Subcategory (e.g., T-shirts, Jeans, Sneakers)
  - Brand (optional)
  - Purchase Date (optional)
  - Purchase Price (optional)
  - Tags (custom tags for personal organization)
  - Notes (free-form text)

#### 1.2 View All Items
- **Grid/List View**: Toggle between grid of images and detailed list
- **Filtering**:
  - By category/subcategory
  - By color
  - By brand
  - By tags
  - By date added
- **Sorting**:
  - Date added (newest/oldest)
  - Alphabetically
  - By category
  - By purchase date
- **Search**: Text search across names, descriptions, brands, tags, notes

#### 1.3 Edit/Delete Items
- Edit any item details
- Replace or add additional photos
- Delete items (with confirmation)
- Archive items (soft delete - keep for history but hide from main view)

---

### 2. Similarity Search

#### 2.1 Visual Similarity Search
- **Photo Upload**: Upload a photo of a clothing item (from store, online, or existing item)
- **Similarity Matching**: 
  - Compare against all items in database
  - Return ranked list of similar items with similarity scores
  - Show side-by-side comparison view

#### 2.2 Text-Based Similarity Search
- **Description Input**: Enter text description (e.g., "red floral summer dress")
- **Natural Language Processing**: 
  - Extract key attributes (color, pattern, style, category)
  - Match against database items
- **Results**: Show matching items ranked by relevance

---

### 3. Automatic Metadata Extraction

#### 3.1 Image Analysis Features
- Extract attributes as per section above


#### 3.2 Metadata Storage
- All extracted metadata stored in database
- Editable by user (override auto-detection if incorrect)
- Used for filtering, searching, and similarity matching

---

## User Flows

### Flow 1: Adding a New Item
1. User clicks "Add Item"
2. User uploads photo(s) or enters description
3. System analyzes image (if provided) and auto-fills metadata
4. User reviews and edits auto-filled data
5. User adds any additional details (brand, price, notes, etc.)
6. User selects owner (self, spouse, or shared)
7. User saves item
8. Item appears in inventory

### Flow 2: Finding Similar Items
1. User clicks "Find Similar"
2. User uploads photo OR enters description
3. System processes input and searches database
4. System displays ranked list of similar items
5. User can click on any result to see full details
6. User can refine search with additional filters

### Flow 3: Browsing Inventory
1. User navigates to "My Closet" or "All Items"
2. Items displayed in grid/list view
3. User can filter by category, color, size, etc.
4. User can search by text
5. User clicks item to view details
6. User can edit or delete from detail view


---

## Data Model

What makes the most sense given the above


---

## Technical Considerations

### Frontend
- **Framework**: React
- **Responsive Design**: Mobile-first approach

### Backend
- **Framework**: Python/Flask/FastAPI
- **Database**: PostgreSQL
- **Image Storage**: 
  - AWS S3
- **Search**:
  - Full-text search (PostgreSQL full-text)
  - Vector similarity search for images (using embeddings)

### AI/ML Components
(TO BE DETERMINED)


### Infrastructure
- **Hosting**: Vercel
- **Database Hosting**: Managed database service

---

## UI/UX Considerations

### Design Principles
- **Clean & Minimal**: Focus on the clothing items, not the UI
- **Visual First**: Images are primary, text is secondary
- **Fast & Responsive**: Quick loading, smooth interactions
- **Intuitive**: Easy to use without training

### Key Screens
1. **Dashboard/Home**: 
   - Quick stats
   - Recent items
   - Quick search bar
   - "Add Item" button
2. **Item Grid/List**: 
   - Filter sidebar
   - Search bar
   - Item cards with image and key info
3. **Item Detail**: 
   - Large image(s)
   - All metadata
   - Edit/Delete actions
   - Similar items section
4. **Add/Edit Item**: 
   - Image upload area
   - Form fields
   - Auto-filled metadata (editable)
5. **Similarity Search**: 
   - Upload/input area
   - Results list with similarity scores
   - Comparison view

### Mobile Considerations
- Touch-friendly buttons and interactions
- Easy photo capture
- Swipe gestures for navigation
- Bottom navigation bar for main actions

---

## Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
- Basic item CRUD (Create, Read, Update, Delete)
- Image upload and storage
- Simple grid/list view
- Basic filtering
- Manual metadata entry (no auto-extraction yet)
- Single user (or basic multi-user)

### Phase 2: Core Features
- Visual similarity search (basic implementation)
- Text-based search
- Automatic color extraction
- Category auto-detection
- Improved filtering and sorting

---



# OUT OF SCOPE

## Additional Features (Brainstormed)

### 4. User Management & Multi-User Support
- **User Accounts**: Separate accounts for you and your wife
- **Shared vs. Personal Items**: 
  - Mark items as "shared" (both can see) or "personal" (owner only)
  - Default view shows all items user has access to
- **User Profiles**: 
  - Personal preferences
  - Size profiles
  - Style preferences

### 5. Outfit Planning & Organization
- **Outfits**: Create and save outfit combinations
- **Outfit Suggestions**: AI-suggested outfits based on items
- **Seasonal Organization**: Tag items by season (spring, summer, fall, winter)
- **Occasion Tags**: Work, casual, formal, workout, etc.

### 6. Statistics & Insights
- **Wardrobe Analytics**:
  - Total number of items
  - Breakdown by category
  - Color distribution
  - Most common brands
  - Average item age
- **Usage Tracking**:
  - Last worn date (manual entry or optional tracking)
  - Most/least worn items
  - Items not worn in X months
- **Spending Insights**:
  - Total wardrobe value
  - Average item cost
  - Spending by category
  - Spending over time

### 7. Shopping Assistant
- **Shopping List**: Create wishlist of desired items
- **Duplicate Prevention**: 
  - Before purchasing, search for similar items
  - Get alerts if item is very similar to existing items
- **Gap Analysis**: Identify missing items (e.g., "You have many tops but few bottoms")
- **Recommendations**: Suggest items that would complement existing wardrobe

### 8. Maintenance & Care
- **Care Instructions**: Store washing/care labels
- **Maintenance Log**: Track repairs, alterations, dry cleaning
- **Replacement Reminders**: Set reminders for items that may need replacing

### 9. Advanced Search & Filtering
- **Multi-Filter**: Combine multiple filters (e.g., "Red tops, size M, purchased in 2023")
- **Saved Searches**: Save frequently used filter combinations
- **Smart Collections**: Auto-generated collections (e.g., "All red items", "Items not worn in 6 months")

### 10. Data Export & Backup
- **Export Data**: Export inventory as CSV/JSON
- **Backup**: Automatic or manual backup of all data and images
- **Import**: Import from other sources (spreadsheets, other apps)

### 11. Mobile Optimization
- **Responsive Design**: Works well on mobile devices
- **Camera Integration**: Easy photo capture on mobile
- **Offline Mode**: Basic functionality when offline (sync when online)

### 12. Privacy & Security
- **Private by Default**: All data stored securely
- **Image Storage**: Secure cloud storage for images
- **Data Encryption**: Encrypted data at rest and in transit