import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';
import { getTasks, createTask, updateTask, deleteTask, Task } from '@/lib/api/tasks';

// Mock the API functions
jest.mock('@/lib/api/tasks', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

describe('useTasks', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2023-01-01'),
    dueDate: new Date('2023-01-10'),
    priority: 'medium' as const,
    recurring: {
      isRecurring: false,
      frequency: null,
      daysOfWeek: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tasks successfully', async () => {
    (getTasks as jest.Mock).mockResolvedValueOnce([mockTask]);

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.fetchTasks();
    });

    expect(result.current.tasks).toEqual([mockTask]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch tasks error', async () => {
    (getTasks as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.fetchTasks();
    });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch tasks');
  });

  it('should add a task successfully', async () => {
    const newTask = { title: 'New Task' };
    (createTask as jest.Mock).mockResolvedValueOnce(mockTask);

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await result.current.addTask(newTask);
    });

    expect(result.current.tasks).toEqual([mockTask]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should toggle task completion successfully', async () => {
    const updatedTask = { ...mockTask, completed: true };
    (createTask as jest.Mock).mockResolvedValueOnce(mockTask);
    (updateTask as jest.Mock).mockResolvedValueOnce(updatedTask);

    const { result } = renderHook(() => useTasks());

    // First add a task
    let addedTask: Task;
    await act(async () => {
      addedTask = await result.current.addTask({ title: 'Test Task' });
    });

    // Then toggle it
    await act(async () => {
      await result.current.toggleTask(addedTask.id, true);
    });

    expect(result.current.tasks[0].completed).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should remove a task successfully', async () => {
    (createTask as jest.Mock).mockResolvedValueOnce(mockTask);
    (deleteTask as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useTasks());

    // First add a task
    let addedTask: Task;
    await act(async () => {
      addedTask = await result.current.addTask({ title: 'Test Task' });
    });

    // Then remove it
    await act(async () => {
      await result.current.removeTask(addedTask.id);
    });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update task title successfully', async () => {
    const updatedTask = { ...mockTask, title: 'Updated Title' };
    (createTask as jest.Mock).mockResolvedValueOnce(mockTask);
    (updateTask as jest.Mock).mockResolvedValueOnce(updatedTask);

    const { result } = renderHook(() => useTasks());

    // First add a task
    let addedTask: Task;
    await act(async () => {
      addedTask = await result.current.addTask({ title: 'Test Task' });
    });

    // Then update its title
    await act(async () => {
      await result.current.updateTaskTitle(addedTask.id, 'Updated Title');
    });

    expect(result.current.tasks[0].title).toBe('Updated Title');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
}); 