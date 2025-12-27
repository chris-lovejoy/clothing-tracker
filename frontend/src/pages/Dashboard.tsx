import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { itemsApi } from '../api/items'
import './Dashboard.css'

export default function Dashboard() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['items', { limit: 6 }],
    queryFn: () => itemsApi.getAll({ limit: 6, sort_by: 'created_at', sort_order: 'desc' }),
  })

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/add" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p className="stat-value">{items?.length || 0}</p>
        </div>
      </div>

      <div className="recent-items">
        <h3>Recent Items</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : items && items.length > 0 ? (
          <div className="items-grid">
            {items.map((item) => (
              <Link key={item.id} to={`/items/${item.id}`} className="item-card">
                {item.image_urls && item.image_urls.length > 0 ? (
                  <img src={item.image_urls[0]} alt={item.name || 'Clothing item'} />
                ) : (
                  <div className="item-placeholder">No Image</div>
                )}
                <div className="item-info">
                  <h4>{item.name || 'Unnamed Item'}</h4>
                  {item.category && <span className="item-category">{item.category}</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No items yet. <Link to="/add">Add your first item!</Link></p>
        )}
      </div>
    </div>
  )
}

