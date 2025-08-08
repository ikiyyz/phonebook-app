import { request } from './request';

// Gunakan 'phonebooks' sebagai base URL untuk semua endpoint
const API_BASE = 'phonebooks';

export const read = (params = {}) => request.get(API_BASE, { params });

export const create = (data) => request.post(API_BASE, data);

export const update = (id, data) => request.put(`${API_BASE}/${id}`, data);

export const remove = (id) => request.delete(`${API_BASE}/${id}`);