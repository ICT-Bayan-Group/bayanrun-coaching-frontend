import { defineStore } from 'pinia'

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    invoiceNumber: null,
    participantData: null,
    successData: null,
    source: 'user'
  }),

  actions: {
    setInvoice(invoice) {
      this.invoiceNumber = invoice
    },
    setParticipantData(data) {
      this.participantData = data
    },
    setSuccessData(data) {
      this.successData = data
    },
    setSource(source) {
      this.source = source
    },
    reset() {
      this.invoiceNumber = null
      this.participantData = null
      this.successData = null
      // source sengaja tidak direset di sini,
      // biar SuccessPage masih bisa baca sebelum reset() dipanggil ulang
    }
  }
})