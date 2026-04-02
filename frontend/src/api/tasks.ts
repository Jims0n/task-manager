import api from './axios';
import { Task, TaskCreateData, TaskUpdateData } from '../types';

export const tasksApi = {
  getAll: async (filters?: { status?: string; priority?: string }): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    
    const response = await api.get<Task[]>(`/tasks/?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}/`);
    return response.data;
  },

  create: async (data: TaskCreateData): Promise<Task> => {
    const response = await api.post<Task>('/tasks/', data);
    return response.data;
  },

  update: async (id: number, data: TaskUpdateData): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}/`);
  },
};
