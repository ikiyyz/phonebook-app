import { request } from './request';

export const read = (params = {}) => request.get('phonebooks', { params });

export const create = (data) => request.post('phonebooks', data);

export const update = (id, data) => request.put(`phonebooks/${id}`, data);

export const remove = (id) => request.delete(`phonebooks/${id}`);