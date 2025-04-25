import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../todo-item";
import { useTodo } from "@/context/todo-context";
import { Todo } from "@/lib/types";

// Mock the useTodo hook
jest.mock("@/context/todo-context", () => ({
  useTodo: jest.fn(),
}));

// Mock the dialog components to avoid testing their implementation
jest.mock("../todo-edit-dialog", () => ({
  TodoEditDialog: () => null,
}));

jest.mock("../todo-delete-dialog", () => ({
  TodoDeleteDialog: () => null,
}));

// Mock date-fns functions
jest.mock("date-fns", () => {
  const actualDateFns = jest.requireActual("date-fns");
  const fixedDate = new Date("2024-03-20T12:00:00Z");
  
  return {
    ...actualDateFns,
    format: (date: Date, formatStr: string) => {
      if (formatStr === 'h:mm a') return '12:00 PM';
      return 'Mar 20, 2024 12:00 PM';
    },
    isToday: (date: Date) => {
      return actualDateFns.isSameDay(date, fixedDate);
    },
    isTomorrow: (date: Date) => {
      const tomorrow = actualDateFns.addDays(fixedDate, 1);
      return actualDateFns.isSameDay(date, tomorrow);
    },
  };
});

describe("TodoItem", () => {
  const mockTodo: Todo = {
    id: "1",
    title: "Test Todo",
    description: "Test Description",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(),
    priority: "medium",
    recurring: {
      isRecurring: true,
      frequency: "daily",
    },
  };

  const completedTodo: Todo = {
    ...mockTodo,
    completed: true,
  };

  const mockToggleComplete = jest.fn();

  beforeEach(() => {
    (useTodo as jest.Mock).mockReturnValue({
      toggleComplete: mockToggleComplete,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo item with correct content", () => {
    render(<TodoItem todo={mockTodo} />);

    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
    expect(screen.getByText(mockTodo.description!)).toBeInTheDocument();
    expect(screen.getByText(mockTodo.priority)).toBeInTheDocument();
    expect(screen.getByText(/Created/)).toBeInTheDocument();
  });

  it("calls toggleComplete when checkbox is clicked", () => {
    render(<TodoItem todo={mockTodo} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockToggleComplete).toHaveBeenCalledWith(mockTodo.id);
  });

  it("applies completed styles when todo is completed", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);

    const title = screen.getByText(completedTodo.title);
    const description = screen.getByText(completedTodo.description!);

    expect(title).toHaveClass("line-through");
    expect(description).toHaveClass("line-through");
  });

  it("shows edit and delete buttons", () => {
    render(<TodoItem todo={mockTodo} />);

    expect(screen.getByLabelText("Edit")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });

  it("shows recurring text when todo is recurring", () => {
    const recurringTodo = {
      ...mockTodo,
      recurring: {
        isRecurring: true,
        frequency: "daily" as const,
      },
    };
    render(<TodoItem todo={recurringTodo} />);

    expect(screen.getByText(/daily/i)).toBeInTheDocument();
  });

  it("renders todo item with correct styles when completed", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);
    expect(screen.getByTestId("todo-item")).toHaveClass("opacity-50");
  });

  it("renders 'Today' when due date is today", () => {
    const todayTodo = {
      ...mockTodo,
      dueDate: new Date("2024-03-20T12:00:00Z"),
    };
    render(<TodoItem todo={todayTodo} />);
    expect(screen.getByText(/Today at/)).toBeInTheDocument();
  });

  it("renders 'Tomorrow' when due date is tomorrow", () => {
    const tomorrowTodo = {
      ...mockTodo,
      dueDate: new Date("2024-03-21T12:00:00Z"),
    };
    render(<TodoItem todo={tomorrowTodo} />);
    expect(screen.getByText(/Tomorrow at/)).toBeInTheDocument();
  });

  it("renders formatted date for other dates", () => {
    const futureTodo = {
      ...mockTodo,
      dueDate: new Date("2024-03-25T12:00:00Z"),
    };
    render(<TodoItem todo={futureTodo} />);
    expect(screen.getByText("Mar 20, 2024 12:00 PM")).toBeInTheDocument();
  });
}); 