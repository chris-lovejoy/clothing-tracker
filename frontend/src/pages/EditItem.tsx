import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itemsApi, ClothingItemUpdate } from '../api/items'
import { uploadApi } from '../api/upload'
import './AddItem.css'

const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Underwear',
  'Activewear',
  'Other',
]

export default function EditItem() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsApi.getById(Number(id)),
    enabled: !!id,
  })

  const [formData, setFormData] = useState<ClothingItemUpdate>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        subcategory: item.subcategory || '',
        brand: item.brand || '',
        tags: item.tags || [],
        notes: item.notes || '',
        purchase_date: item.purchase_date || undefined,
        purchase_price: item.purchase_price || undefined,
      })
    }
  }, [item])

  const updateMutation = useMutation({
    mutationFn: (data: ClothingItemUpdate) => itemsApi.update(Number(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', id] })
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate(`/items/${id}`)
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrls: string[] = item?.image_urls || []
      if (selectedFiles.length > 0) {
        const newUrls = await uploadApi.uploadImages(selectedFiles)
        imageUrls = [...imageUrls, ...newUrls]
      }

      const itemData: ClothingItemUpdate = {
        ...formData,
        image_urls: imageUrls,
        tags: formData.tags || [],
      }

      updateMutation.mutate(itemData)
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!item) {
    return <div>Item not found</div>
  }

  return (
    <div className="add-item-page">
      <h2>Edit Item</h2>

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-section">
          <h3>Images</h3>
          {item.image_urls && item.image_urls.length > 0 && (
            <div className="existing-images">
              <p>Current images:</p>
              <div className="image-preview-grid">
                {item.image_urls.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img src={url} alt={`Current ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <p>New files to add: {selectedFiles.length}</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="e.g., Blue Summer Dress"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory || ''}
                onChange={handleInputChange}
                placeholder="e.g., T-shirts, Jeans"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand || ''}
              onChange={handleInputChange}
              placeholder="Optional brand name"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Purchase Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="purchase_date">Purchase Date</label>
              <input
                type="date"
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date ? new Date(formData.purchase_date).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchase_price">Purchase Price</label>
              <input
                type="number"
                id="purchase_price"
                name="purchase_price"
                value={formData.purchase_price || ''}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Tags</h3>
          <div className="tag-input-group">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Add a tag and press Enter"
              className="tag-input"
            />
            <button type="button" onClick={handleAddTag} className="btn btn-secondary">
              Add Tag
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="tags">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Notes</h3>
          <div className="form-group">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any additional notes about this item"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/items/${id}`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || updateMutation.isPending}
          >
            {uploading || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

