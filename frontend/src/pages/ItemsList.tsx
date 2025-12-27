import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { itemsApi, ItemsFilters } from '../api/items'
import './ItemsList.css'

export default function ItemsList() {
  const [filters, setFilters] = useState<ItemsFilters>({
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 50,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: items, isLoading } = useQuery({
    queryKey: ['items', filters, searchTerm],
    queryFn: () => itemsApi.getAll({ ...filters, search: searchTerm || undefined }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => itemsApi.getCategories(),
  })

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => itemsApi.getBrands(),
  })

  const handleFilterChange = (key: keyof ItemsFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const clearFilters = () => {
    setFilters({ sort_by: 'created_at', sort_order: 'desc', limit: 50 })
    setSearchTerm('')
  }

  return (
    <div className="items-list-page">
      <div className="page-header">
        <h2>My Closet</h2>
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="filter-select"
          >
            <option value="">All Brands</option>
            {brands?.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            className="filter-select"
          >
            <option value="created_at">Date Added</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="purchase_date">Purchase Date</option>
          </select>

          <select
            value={filters.sort_order || 'desc'}
            onChange={(e) => handleFilterChange('sort_order', e.target.value)}
            className="filter-select"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading items...</p>
      ) : items && items.length > 0 ? (
        <div className={viewMode === 'grid' ? 'items-grid' : 'items-list'}>
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
                {item.brand && <span className="item-brand">{item.brand}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No items found. <Link to="/add">Add your first item!</Link></p>
      )}
    </div>
  )
}

