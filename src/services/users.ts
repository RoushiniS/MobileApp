import { fetchData } from './api';

export const getUsers = () => fetchData('/api/v1/users/');
export const getUserById = (id: string) => fetchData(`/api/v1/users/${id}`);