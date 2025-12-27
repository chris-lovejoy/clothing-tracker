import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { itemsApi, ClothingItemCreate } from '../api/items'
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

export default function AddItem() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ClothingItemCreate>({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    tags: [],
    notes: '',
    image_urls: [],
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const createMutation = useMutation({
    mutationFn: (item: ClothingItemCreate) => itemsApi.create(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/items')
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
      let imageUrls: string[] = []
      if (selectedFiles.length > 0) {
        imageUrls = await uploadApi.uploadImages(selectedFiles)
      }

      const itemData: ClothingItemCreate = {
        ...formData,
        image_urls: imageUrls,
        tags: formData.tags || [],
      }

      createMutation.mutate(itemData)
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="add-item-page">
      <h2>Add New Item</h2>

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-section">
          <h3>Images</h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <p>Selected files: {selectedFiles.length}</p>
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
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Blue Summer Dress"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
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
                value={formData.category}
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
                value={formData.subcategory}
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
              value={formData.brand}
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
                value={formData.purchase_date || ''}
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
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any additional notes about this item"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || createMutation.isPending}
          >
            {uploading || createMutation.isPending ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  )
}

