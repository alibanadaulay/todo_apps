import axios from 'axios';

// Use environment variable for API URL with fallback to localhost
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const API_BASE_URL = 'https://todobe-production-e862.up.railway.app/api/v1' 


export interface Task { 
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  recurring?: {
    isRecurring: boolean;
    frequency: "daily" | "weekly" | null;
    daysOfWeek?: number[];
  };
  imageUrl?: string;
  updatedAt?: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | Date;
  priority?: "low" | "medium" | "high";
  recurring?: {
    isRecurring: boolean;
    frequency: "daily" | "weekly" | null;
    daysOfWeek?: number[];
  };
  imageUrl?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  recurring?: {
    isRecurring: boolean;
    frequency: "daily" | "weekly" | null;
    daysOfWeek?: number[];        
  };
  imageUrl?: string;
}

// Helper function to format task data
const formatTaskResponse = (task: any): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  completed: task.completed,
  createdAt: new Date(task.createdAt),
  dueDate: new Date(task.dueDate),
  priority: task.priority,
  imageUrl: task.imageUrl,
  updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
  recurring: {
    isRecurring: false,
    frequency: null,
    daysOfWeek: []
  }
});

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  
  // Check if response has the expected structure
  if (!response.data || !response.data.data || !response.data.data.tasks) {
    throw new Error('Invalid response format');
  }
  
  return response.data.data.tasks.map(formatTaskResponse);
};

// Get a single task by ID
export const getTaskById = async (id: string | number): Promise<Task> => {
  const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
  
  // Check if response has the expected structure
  if (!response.data || !response.data.data) {
    throw new Error('Invalid response format');
  }
  
  return formatTaskResponse(response.data.data);
};

// Create a new task
export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  // Format the input data
  const formattedInput = {
    ...input,
    // Convert Date to ISO string if it's a Date object
    dueDate: input.dueDate instanceof Date ? input.dueDate.toISOString() : input.dueDate,
  };

  const response = await axios.post(`${API_BASE_URL}/tasks`, formattedInput);
  
  // Check if response has the expected structure
  if (!response.data || !response.data.data) {
    throw new Error('Invalid response format');
  }
  
  return formatTaskResponse(response.data.data);
};

// Update a task
export const updateTask = async (id: string | number, input: UpdateTaskInput): Promise<Task> => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, input);
  
  // Check if response has the expected structure
  if (!response.data || !response.data.data) {
    throw new Error('Invalid response format');
  }
  
  return formatTaskResponse(response.data.data);
};

// Delete a task
export const deleteTask = async (id: string | number): Promise<void> => {
  const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`);
  
  // Check if response has the expected structure
  if (!response.data || !response.data.success) {
    throw new Error('Failed to delete task');
  }
};