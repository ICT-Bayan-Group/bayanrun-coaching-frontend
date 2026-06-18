import { defineStore } from 'pinia'

export const useRegistrationStore = defineStore('registration', {
  state: () => ({
    invoiceNumber: null,
    participantData: null,
    successData: null,
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
    reset() {
      this.invoiceNumber = null
      this.participantData = null
      this.successData = null
    }
  }
})
