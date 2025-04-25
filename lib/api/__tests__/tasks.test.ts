import axios from 'axios';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../tasks';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Tasks API', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    dueDate: '2023-01-10T14:30:00.000Z',
    priority: 'medium',
    recurring: {
      isRecurring: false,
      frequency: null,
      daysOfWeek: [],
    },
  };

  const mockResponse = {
    data: {
      data: {
        tasks: [mockTask],
      },
    },
  };

  const mockSingleResponse = {
    data: {
      data: mockTask,
    },
  };

  const mockSuccessResponse = {
    data: {
      success: true,
      message: 'Task deleted successfully',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('fetches all tasks successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getTasks();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Test Task');
    });

    it('handles errors when fetching tasks', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch tasks'));

      await expect(getTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  describe('getTaskById', () => {
    it('fetches a single task by ID successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce(mockSingleResponse);

      const result = await getTaskById('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/1');
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Task');
    });

    it('handles errors when fetching a task by ID', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch task'));

      await expect(getTaskById('1')).rejects.toThrow('Failed to fetch task');
    });
  });

  describe('createTask', () => {
    const newTask = {
      title: 'New Task',
      description: 'New Description',
      dueDate: new Date('2023-01-15T10:00:00.000Z'),
      priority: 'high' as const,
      recurring: {
        isRecurring: false,
        frequency: null,
        daysOfWeek: [],
      },
    };

    it('creates a new task successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce(mockSingleResponse);

      const result = await createTask(newTask);

      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks', {
        ...newTask,
        dueDate: newTask.dueDate.toISOString(),
      });
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Task');
    });

    it('handles errors when creating a task', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Failed to create task'));

      await expect(createTask(newTask)).rejects.toThrow('Failed to create task');
    });
  });

  describe('updateTask', () => {
    const updateData = {
      title: 'Updated Task',
      description: 'Updated Description',
      completed: true,
      dueDate: new Date('2023-01-20T15:00:00.000Z'),
      priority: 'low' as const,
      recurring: {
        isRecurring: true,
        frequency: 'daily' as const,
        daysOfWeek: [],
      },
    };

    it('updates a task successfully', async () => {
      mockedAxios.put.mockResolvedValueOnce(mockSingleResponse);

      const result = await updateTask('1', updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/1', updateData);
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Task');
    });

    it('handles errors when updating a task', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Failed to update task'));

      await expect(updateTask('1', updateData)).rejects.toThrow('Failed to update task');
    });
  });

  describe('deleteTask', () => {
    it('deletes a task successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce(mockSuccessResponse);

      await deleteTask('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/api/v1/tasks/1');
    });

    it('handles errors when deleting a task', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Failed to delete task'));

      await expect(deleteTask('1')).rejects.toThrow('Failed to delete task');
    });

    it('throws an error when the response does not indicate success', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: {
          success: false,
          message: 'Failed to delete task',
        },
      });

      await expect(deleteTask('1')).rejects.toThrow('Failed to delete task');
    });
  });
}); 