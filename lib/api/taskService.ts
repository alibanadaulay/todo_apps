import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from './config';
import { TaskListResponse, SingleTaskResponse, Task } from '../types';

export const taskService = {
  getTasks: async (page: number = 1, limit: number = 10): Promise<TaskListResponse> => {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.TASKS}?page=${page}&limit=${limit}`;
      console.log('Fetching tasks from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        mode: 'cors',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Parsed response:', data);

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      if (!('success' in data) || !('data' in data)) {
        throw new Error('Response missing required fields');
      }

      // Ensure we have the tasks array
      if (!data.data.tasks || !Array.isArray(data.data.tasks)) {
        throw new Error('Tasks array is missing or invalid');
      }

      // Transform dates in tasks array
      const transformedTasks = data.data.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: new Date(task.dueDate)
      }));

      return {
        success: data.success,
        message: data.message,
        data: {
          pagination: data.data.pagination,
          tasks: transformedTasks
        }
      } as TaskListResponse;
    } catch (error) {
      console.error('Error in getTasks:', error);
      throw error;
    }
  },
}; 