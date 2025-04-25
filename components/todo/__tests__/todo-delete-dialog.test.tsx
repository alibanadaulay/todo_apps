import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoDeleteDialog } from '../todo-delete-dialog';
import { useTodo } from '@/context/todo-context';

// Mock the useTodo hook
jest.mock('@/context/todo-context', () => ({
  useTodo: jest.fn(),
}));

describe('TodoDeleteDialog', () => {
  const mockTodoId = '1';
  const mockTodoTitle = 'Test Todo';
  const mockOnOpenChange = jest.fn();
  
  const mockDeleteTodo = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodo as jest.Mock).mockReturnValue({
      deleteTodo: mockDeleteTodo,
    });
  });

  it('renders the dialog with todo title', () => {
    render(
      <TodoDeleteDialog
        todoId={mockTodoId}
        todoTitle={mockTodoTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Check if dialog title is rendered
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    
    // Check if todo title is in the description
    expect(screen.getByText(`This will permanently delete the todo "${mockTodoTitle}" and cannot be undone.`)).toBeInTheDocument();
  });

  it('calls deleteTodo when delete button is clicked', async () => {
    render(
      <TodoDeleteDialog
        todoId={mockTodoId}
        todoTitle={mockTodoTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Click the delete button
    fireEvent.click(screen.getByText('Delete'));

    // Wait for the deleteTodo function to be called
    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodoId);
    });

    // Check if onOpenChange was called with false to close the dialog
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes the dialog when cancel button is clicked', () => {
    render(
      <TodoDeleteDialog
        todoId={mockTodoId}
        todoTitle={mockTodoTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check if onOpenChange was called with false
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles errors during deletion', async () => {
    // Mock deleteTodo to throw an error
    mockDeleteTodo.mockRejectedValueOnce(new Error('Delete failed'));

    render(
      <TodoDeleteDialog
        todoId={mockTodoId}
        todoTitle={mockTodoTitle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Click the delete button
    fireEvent.click(screen.getByText('Delete'));

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodoId);
    });

    // Dialog should remain open
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });
}); 