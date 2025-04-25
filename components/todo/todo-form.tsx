'use client';

import { useState } from 'react';
import { useTodo } from '@/context/todo-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TodoImageUpload } from '@/components/todo/todo-image-upload';
import { toast } from 'sonner';

export function TodoForm() {
  const { addTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        imageUrl,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setImageUrl(undefined);
      
      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Select
          value={priority}
          onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <TodoImageUpload
          value={imageUrl}
          onChange={setImageUrl}
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Todo'}
      </Button>
    </form>
  );
} 