import { Todo, TodoFilters } from "@/lib/types";
import { format, isSameDay, isToday, isTomorrow, addDays } from "date-fns";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function filterTodos(todos: Todo[], filters: TodoFilters): Todo[] {
  let filteredTodos = [...todos];
  
  // Filter by status
  if (filters.status === "active") {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  } else if (filters.status === "completed") {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }
  
  // Sort todos
  filteredTodos.sort((a, b) => {
    switch (filters.sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "date":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "dueDate":
        return a.dueDate.getTime() - b.dueDate.getTime();
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });
  
  return filteredTodos;
}

export function getPriorityColor(priority: Todo["priority"]): string {
  switch (priority) {
    case "high":
      return "text-red-500 border-red-500";
    case "medium":
      return "text-amber-500 border-amber-500";
    case "low":
      return "text-green-500 border-green-500";
    default:
      return "text-slate-500 border-slate-500";
  }
}

export function formatDueDate(date: Date): string {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, yyyy h:mm a');
}

export function getRecurringText(todo: Todo): string {
  if (!todo.recurring.isRecurring) return '';
  
  if (todo.recurring.frequency === 'daily') {
    return 'Repeats daily';
  } else if (todo.recurring.frequency === 'weekly' && todo.recurring.daysOfWeek) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedDays = todo.recurring.daysOfWeek
      .map(day => days[day])
      .join(', ');
    return `Repeats weekly on ${selectedDays}`;
  }
  
  return '';
}