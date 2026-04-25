import api from '@/lib/api';
import { Notification } from '@/types';

export const NotificationService = {
  async getNotifications() {
    const response = await api.get<Notification[]>('/notifications/');
    return response.data;
  },

  async markAsRead(id: number) {
    const response = await api.post(`/notifications/${id}/mark_as_read/`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark_all_as_read/');
    return response.data;
  },
};
