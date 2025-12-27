import apiClient from './client'

export interface ClothingItem {
  id: number
  name: string | null
  description: string | null
  category: string | null
  subcategory: string | null
  brand: string | null
  purchase_date: string | null
  purchase_price: number | null
  tags: string[]
  notes: string | null
  image_urls: string[]
  created_at: string
  updated_at: string | null
  owner: string
}

export interface ClothingItemCreate {
  name?: string
  description?: string
  category?: string
  subcategory?: string
  brand?: string
  purchase_date?: string
  purchase_price?: number
  tags?: string[]
  notes?: string
  image_urls?: string[]
  owner?: string
}

export interface ClothingItemUpdate {
  name?: string
  description?: string
  category?: string
  subcategory?: string
  brand?: string
  purchase_date?: string
  purchase_price?: number
  tags?: string[]
  notes?: string
  image_urls?: string[]
  owner?: string
}

export interface ItemsFilters {
  category?: string
  subcategory?: string
  brand?: string
  search?: string
  sort_by?: 'created_at' | 'name' | 'category' | 'purchase_date'
  sort_order?: 'asc' | 'desc'
  owner?: string
  skip?: number
  limit?: number
}

export const itemsApi = {
  getAll: async (filters?: ItemsFilters): Promise<ClothingItem[]> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const response = await apiClient.get(`/api/items?${params.toString()}`)
    return response.data
  },

  getById: async (id: number): Promise<ClothingItem> => {
    const response = await apiClient.get(`/api/items/${id}`)
    return response.data
  },

  create: async (item: ClothingItemCreate): Promise<ClothingItem> => {
    const response = await apiClient.post('/api/items', item)
    return response.data
  },

  update: async (id: number, item: ClothingItemUpdate): Promise<ClothingItem> => {
    const response = await apiClient.put(`/api/items/${id}`, item)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/items/${id}`)
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/items/filters/categories')
    return response.data
  },

  getBrands: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/items/filters/brands')
    return response.data
  },
}

