"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Todo, TodoFilters, AddTodoInput, UpdateTodoInput } from "@/lib/types";
import { Task, CreateTaskInput } from "@/lib/api/tasks";
import { toast } from "sonner";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";

type TodoContextType = {
  todos: Todo[];
  filters: TodoFilters;
  loading: boolean;
  error: string | null;
  addTodo: (data: AddTodoInput) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TodoFilters>) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Convert Task to Todo
const taskToTodo = (task: Task): Todo => ({
  id: String(task.id),
  title: task.title,
  description: task.description || "",
  completed: task.completed,
  createdAt: new Date(task.createdAt),
  dueDate: new Date(task.dueDate),
  priority: task.priority,
  recurring: task.recurring || {
    isRecurring: false,
    frequency: null,
  },
  imageUrl: task.imageUrl,
});

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TodoFilters>({
    status: "all",
    sortBy: "date",
  });

  // Load todos from API on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTasks();
        setTodos(data.map(taskToTodo));
      } catch (err) {
        setError('Failed to fetch todos');
        console.error(err);
        toast.error('Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (data: AddTodoInput) => {
    try {
      setLoading(true);
      setError(null);
      const taskInput: CreateTaskInput = {
        title: data.title,
        description: data.description || "",
        dueDate: data.dueDate?.toISOString() || new Date().toISOString(),
        priority: data.priority || "medium",
        recurring: {
          isRecurring: false,
          frequency: null,
        },
        imageUrl: data.imageUrl,
      };
      const newTask = await createTask(taskInput);
      const newTodo = taskToTodo(newTask);
      setTodos(prev => [newTodo, ...prev]);
      toast.success("Todo added successfully");
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
      toast.error('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, data: UpdateTodoInput) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTask(id, {
        title: data.title,
        description: data.description || "",
        completed: data.completed,
        dueDate: data.dueDate,
        priority: data.priority,
        recurring: {
          isRecurring: false,
          frequency: null,
        },
        imageUrl: data.imageUrl,
      });
      const updatedTodo = taskToTodo(updatedTask);
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      );
      toast.success("Todo updated successfully");
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
      toast.error('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast.success("Todo removed successfully");
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
      toast.error('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      try {
        setLoading(true);
        setError(null);
        const updatedTask = await updateTask(id, {
          title: todo.title,
          description: todo.description || "",
          completed: !todo.completed,
          dueDate: todo.dueDate,
          priority: todo.priority,
          recurring: {
            isRecurring: false,
            frequency: null,
          },
          imageUrl: todo.imageUrl,
        });
        const updatedTodo = taskToTodo(updatedTask);
        setTodos(prev => 
          prev.map(t => 
            t.id === id ? updatedTodo : t
          )
        );
      } catch (err) {
        setError('Failed to toggle todo');
        console.error(err);
        toast.error('Failed to toggle todo');
      } finally {
        setLoading(false);
      }
    }
  };

  const setFilters = (newFilters: Partial<TodoFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filters,
        loading,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        setFilters,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}