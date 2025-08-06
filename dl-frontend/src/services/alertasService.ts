import { api } from '@/config/api';

export async function getAlertas() {
  return await api.get('/alertas');
} 