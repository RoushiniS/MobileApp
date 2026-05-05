import { fetchData } from './api';

export const getDeliveries = () => fetchData('/api/v1/deliveries/');
export const getDeliveryById = (id: string) => fetchData(`/api/v1/deliveries/${id}`);
export const createDelivery = (body: object) =>
  fetchData('/api/v1/deliveries/', { method: 'POST', body: JSON.stringify(body) });