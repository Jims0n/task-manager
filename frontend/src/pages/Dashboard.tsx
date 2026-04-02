import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksApi } from '../api/tasks';
import { Task, TaskCreateData } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [formData, setFormData] = useState<TaskCreateData>({
    title: '',
    description: '',
    due_date: null,
    priority: 'medium',
    status: 'todo',
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const filters: { status?: string; priority?: string } = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;
      const data = await tasksApi.getAll(filters);
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, formData);
      } else {
        await tasksApi.create(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      priority: task.priority,
      status: task.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(id);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      await tasksApi.update(task.id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: null,
      priority: 'medium',
      status: 'todo',
    });
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    resetForm();
    setShowModal(true);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'done': return 'status-done';
      case 'in_progress': return 'status-in-progress';
      case 'todo': return 'status-todo';
      default: return '';
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.first_name || user?.email}</span>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-controls">
        <button onClick={openNewTaskModal} className="btn btn-primary">
          + New Task
        </button>
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${getStatusClass(task.status)}`}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              {task.due_date && (
                <p className="task-due-date">Due: {new Date(task.due_date).toLocaleDateString()}</p>
              )}
              <div className="task-status">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="task-actions">
                <button onClick={() => handleEdit(task)} className="btn btn-small">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn btn-small btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Task title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  type="date"
                  id="due_date"
                  value={formData.due_date || ''}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value || null })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
