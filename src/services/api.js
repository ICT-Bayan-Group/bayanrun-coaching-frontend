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
    const message = error.response?.data?.message || error.message || ''
    const isCapacityLockError = /registration_capacity_locks|SQLSTATE\[42S02\]|base table or view not found/i.test(message)
    const containsDatabaseDetails = /SQLSTATE|Connection: mysql|select \* from|doesn't exist/i.test(message)
    const userMessage = isCapacityLockError
      ? 'Slot sudah penuh. Pendaftaran untuk sesi ini tidak dapat dilanjutkan.'
      : containsDatabaseDetails
        ? 'Pendaftaran gagal diproses. Silakan coba lagi atau hubungi panitia.'
        : message || 'Terjadi kesalahan jaringan. Silakan coba lagi.'
    return Promise.reject({ ...error, userMessage })
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
