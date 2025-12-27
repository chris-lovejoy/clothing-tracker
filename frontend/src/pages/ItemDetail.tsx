import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itemsApi } from '../api/items'
import './ItemDetail.css'

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsApi.getById(Number(id)),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => itemsApi.delete(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/items')
    },
  })

  const handleDelete = () => {
    if (item && window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(item.id)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!item) {
    return <div>Item not found</div>
  }

  return (
    <div className="item-detail">
      <div className="item-detail-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
        <div className="item-actions">
          <Link to={`/items/${item.id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="item-detail-content">
        <div className="item-images">
          {item.image_urls && item.image_urls.length > 0 ? (
            <div className="image-gallery">
              {item.image_urls.map((url, index) => (
                <img key={index} src={url} alt={`${item.name || 'Item'} - ${index + 1}`} />
              ))}
            </div>
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>

        <div className="item-details">
          <h2>{item.name || 'Unnamed Item'}</h2>

          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              {item.category && (
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{item.category}</span>
                </div>
              )}
              {item.subcategory && (
                <div className="detail-item">
                  <span className="detail-label">Subcategory:</span>
                  <span className="detail-value">{item.subcategory}</span>
                </div>
              )}
              {item.brand && (
                <div className="detail-item">
                  <span className="detail-label">Brand:</span>
                  <span className="detail-value">{item.brand}</span>
                </div>
              )}
              {item.purchase_date && (
                <div className="detail-item">
                  <span className="detail-label">Purchase Date:</span>
                  <span className="detail-value">
                    {new Date(item.purchase_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {item.purchase_price && (
                <div className="detail-item">
                  <span className="detail-label">Purchase Price:</span>
                  <span className="detail-value">${item.purchase_price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {item.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="detail-section">
              <h3>Tags</h3>
              <div className="tags">
                {item.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.notes && (
            <div className="detail-section">
              <h3>Notes</h3>
              <p>{item.notes}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>Metadata</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Added:</span>
                <span className="detail-value">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              {item.updated_at && (
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

