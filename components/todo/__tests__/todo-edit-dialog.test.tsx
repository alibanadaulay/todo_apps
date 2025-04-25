import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoEditDialog } from '../todo-edit-dialog';
import { useTodo } from '@/context/todo-context';

// Mock the useTodo hook
jest.mock('@/context/todo-context', () => ({
  useTodo: jest.fn(),
}));

// Mock date-fns
jest.doMock('date-fns', () => ({
  __esModule: true,
  format: (date: Date, formatStr: string) => {
    if (formatStr === 'yyyy-MM-dd') {
      return '2023-01-10';
    } else if (formatStr === 'HH:mm') {
      return '14:30';
    }
    return '';
  }
}));

describe('TodoEditDialog', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2023-01-01'),
    dueDate: new Date('2023-01-10T14:30:00'),
    priority: 'medium' as const,
    recurring: {
      isRecurring: false,
      frequency: null,
      daysOfWeek: [],
    },
  };

  const mockUpdateTodo = jest.fn().mockResolvedValue(undefined);
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodo as jest.Mock).mockReturnValue({
      updateTodo: mockUpdateTodo,
    });
  });

  it('renders the dialog with todo data', () => {
    render(
      <TodoEditDialog
        todo={mockTodo}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Check if dialog title is rendered
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();

    // Check if form fields are rendered with correct values
    expect(screen.getByLabelText('Title')).toHaveValue('Test Todo');
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    // Priority is in a Select component, so we can't directly check its value
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
  });

  it('calls updateTodo with correct data when form is submitted', async () => {
    render(
      <TodoEditDialog
        todo={mockTodo}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Fill in the form
    await userEvent.clear(screen.getByLabelText('Title'));
    await userEvent.type(screen.getByLabelText('Title'), 'Updated Todo');
    
    await userEvent.clear(screen.getByLabelText('Description'));
    await userEvent.type(screen.getByLabelText('Description'), 'Updated Description');
    
    // Change priority - this is more complex with Radix UI Select
    // We'll simulate the change by directly calling the form's setValue
    const prioritySelect = screen.getByLabelText('Priority');
    fireEvent.click(prioritySelect);
    fireEvent.click(screen.getByText('High'));

    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));

    // Wait for the updateTodo function to be called
    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', {
        title: 'Updated Todo',
        description: 'Updated Description',
        dueDate: expect.any(Date),
        priority: 'high',
        recurring: {
          isRecurring: false,
          frequency: null,
          daysOfWeek: undefined,
        },
      });
    });

    // Check if onOpenChange was called with false to close the dialog
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles recurring todo settings correctly', async () => {
    const recurringTodo = {
      ...mockTodo,
      recurring: {
        isRecurring: true,
        frequency: 'weekly' as const,
        daysOfWeek: [1, 3, 5],
      },
    };

    render(
      <TodoEditDialog
        todo={recurringTodo}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Check if recurring switch is checked
    const recurringSwitch = screen.getByRole('switch');
    expect(recurringSwitch).toBeChecked();

    // Check if frequency is set to weekly
    expect(screen.getByLabelText('Frequency')).toBeInTheDocument();

    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));

    // Wait for the updateTodo function to be called
    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', {
        title: 'Test Todo',
        description: 'Test Description',
        dueDate: expect.any(Date),
        priority: 'medium',
        recurring: {
          isRecurring: true,
          frequency: 'weekly',
          daysOfWeek: [1, 3, 5],
        },
      });
    });
  });

  it('handles errors during submission', async () => {
    // Mock updateTodo to throw an error
    mockUpdateTodo.mockRejectedValueOnce(new Error('Update failed'));

    render(
      <TodoEditDialog
        todo={mockTodo}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalled();
    });

    // Dialog should remain open
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it('closes the dialog when dialog is closed', () => {
    render(
      <TodoEditDialog
        todo={mockTodo}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Close the dialog by clicking outside or pressing Escape
    // This is simulated by directly calling onOpenChange
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    // Check if onOpenChange was called with false
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
}); 