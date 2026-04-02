export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in_progress' | 'done';
}

export interface TaskUpdateData extends Partial<TaskCreateData> {}
