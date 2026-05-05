import { fetchData } from './api';

export const getDonations = () => fetchData('/api/v1/donations/');
export const getDonationById = (id: string) => fetchData(`/api/v1/donations/${id}`);
export const createDonation = (body: object) =>
  fetchData('/api/v1/donations/', { method: 'POST', body: JSON.stringify(body) });