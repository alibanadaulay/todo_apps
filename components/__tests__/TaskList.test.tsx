import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskList } from '../TaskList';
import { useTasks } from '@/hooks/useTasks';

// Mock the useTasks hook
jest.mock('@/hooks/useTasks');

describe('TaskList', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      completed: false,
      createdAt: new Date('2023-01-01'),
      dueDate: new Date('2023-01-10'),
      priority: 'medium' as const,
      recurring: {
        isRecurring: false,
        frequency: null,
        daysOfWeek: [],
      },
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      completed: true,
      createdAt: new Date('2023-01-02'),
      dueDate: new Date('2023-01-11'),
      priority: 'high' as const,
      recurring: {
        isRecurring: false,
        frequency: null,
        daysOfWeek: [],
      },
    },
  ];

  const mockUseTasks = {
    tasks: mockTasks,
    loading: false,
    error: null,
    fetchTasks: jest.fn(),
    addTask: jest.fn(),
    toggleTask: jest.fn(),
    removeTask: jest.fn(),
    updateTaskTitle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTasks as jest.Mock).mockReturnValue(mockUseTasks);
  });

  it('renders loading state', () => {
    (useTasks as jest.Mock).mockReturnValue({
      ...mockUseTasks,
      loading: true,
    });

    render(<TaskList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useTasks as jest.Mock).mockReturnValue({
      ...mockUseTasks,
      error: 'Failed to fetch tasks',
    });

    render(<TaskList />);
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
  });

  it('renders tasks list', () => {
    render(<TaskList />);
    
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task 2')).toBeInTheDocument();
  });

  it('adds a new task', async () => {
    render(<TaskList />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockUseTasks.addTask).toHaveBeenCalledWith({ title: 'New Task' });
    });
  });

  it('toggles task completion', async () => {
    render(<TaskList />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(mockUseTasks.toggleTask).toHaveBeenCalledWith('1', true);
    });
  });

  it('updates task title', async () => {
    render(<TaskList />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'Updated Task 1' } });

    await waitFor(() => {
      expect(mockUseTasks.updateTaskTitle).toHaveBeenCalledWith('1', 'Updated Task 1');
    });
  });

  it('removes a task', async () => {
    render(<TaskList />);
    
    // Get all delete buttons (they have the Trash2 icon)
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg.lucide-trash2')
    );
    
    // Click the first delete button (for task with ID '1')
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockUseTasks.removeTask).toHaveBeenCalledWith('1');
    });
  });

  it('applies completed task styling', () => {
    render(<TaskList />);
    
    const completedTaskInput = screen.getByDisplayValue('Test Task 2');
    expect(completedTaskInput).toHaveClass('line-through');
  });
}); 