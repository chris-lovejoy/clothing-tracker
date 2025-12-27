import apiClient from './client'

export const uploadApi = {
  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Return URLs as-is - proxy will handle /uploads/ routes
    // For S3 URLs, they'll be absolute and work directly
    return response.data.image_urls
  },
}

