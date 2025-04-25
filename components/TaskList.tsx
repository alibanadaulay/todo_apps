import { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

export const TaskList = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    removeTask,
    updateTaskTitle,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('taskInput') as HTMLInputElement;
    const title = input.value.trim();

    if (title) {
      await addTask({ title });
      input.value = '';
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          name="taskInput"
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 border rounded-lg"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => 
                toggleTask(task.id, checked as boolean)
              }
            />
            <Input
              value={task.title}
              onChange={(e) => updateTaskTitle(task.id, e.target.value)}
              className={`flex-1 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}; 