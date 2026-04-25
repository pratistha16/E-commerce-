import api from '@/lib/api';

export const PaymentService = {
  async processPayment(orderIds: number[], method: string = 'STRIPE') {
    const response = await api.post('/payments/process_payment/', { order_ids: orderIds, method });
    return response.data;
  },

  async getPayments() {
    const response = await api.get('/payments/');
    return response.data;
  },
};
