import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Terjadi kesalahan jaringan'
    return Promise.reject({ ...error, userMessage: message })
  }
)

export const participantApi = {
  /**
   * Fetch participant by invoice number (QR scan result)
   */
  async getByInvoice(invoiceNumber) {
    const { data } = await api.get(`/participant/${invoiceNumber}`)
    return data
  },

  /**
   * Submit registration
   */
  async register(payload) {
    const { data } = await api.post('/register', payload)
    return data
  }
}

export default api
