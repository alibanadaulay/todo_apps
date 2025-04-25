import { useState, useCallback } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, getTasks, getTaskById, createTask, updateTask, deleteTask } from '@/lib/api/tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await createTask(input);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTask(id, { completed });
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskTitle = useCallback(async (id: string, title: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTask(id, { title });
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    removeTask,
    updateTaskTitle,
  };
}; 