export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  recurring: {
    isRecurring: boolean;
    frequency: "daily" | "weekly" | null;
    daysOfWeek?: number[];
  };
  imageUrl?: string; // URL to the uploaded image
}

export type TodoFilters = {
  status: "all" | "active" | "completed";
  sortBy: "priority" | "date" | "dueDate" | "alphabetical";
}

export type AddTodoInput = {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  imageUrl?: string;
  completed?: boolean;
  dueDate?: Date;
  recurring?: {
    isRecurring: boolean;
    frequency: "daily" | "weekly" | null;
    daysOfWeek?: number[];
  };
};

export type UpdateTodoInput = Partial<Omit<Todo, "id" | "createdAt">>;

export interface Pagination {
  limit: number;
  offset: number;
  page: number;
  pages: number;
  total: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: {
    pagination: Pagination;
    tasks: Task[];
  };
}

export interface SingleTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}