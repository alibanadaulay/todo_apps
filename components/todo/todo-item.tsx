"use client";

import { useState } from "react";
import { Todo } from "@/lib/types";
import { useTodo } from "@/context/todo-context";
import { Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getPriorityColor, formatDueDate, getRecurringText } from "@/lib/todo-utils";
import { TodoEditDialog } from "@/components/todo/todo-edit-dialog";
import { TodoDeleteDialog } from "@/components/todo/todo-delete-dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete } = useTodo();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const priorityColor = getPriorityColor(todo.priority);
  const recurringText = getRecurringText(todo);
  
  return (
    <div 
      className={cn(
        "p-4 border rounded-lg transition-all bg-card",
        "hover:shadow-md",
        todo.completed && "bg-muted/40"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={todo.completed}
          onCheckedChange={() => toggleComplete(todo.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 
              className={cn(
                "font-medium truncate",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-1 shrink-0">
              <span 
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border capitalize",
                  priorityColor
                )}
              >
                {todo.priority}
              </span>
            </div>
          </div>
          
          {todo.description && (
            <p 
              className={cn(
                "text-sm mt-1 text-muted-foreground",
                todo.completed && "line-through"
              )}
            >
              {todo.description}
            </p>
          )}

          {todo.imageUrl && (
            <div className="relative w-full h-48 mt-2">
              <Image
                src={todo.imageUrl}
                alt={`${todo.title} image`}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDueDate(todo.dueDate)}</span>
            </div>
            
            {recurringText && (
              <span className="px-1.5 py-0.5 bg-secondary rounded-full">
                {recurringText}
              </span>
            )}
          </div>
          
          <div className="flex items-center mt-2 pt-2 border-t text-xs text-muted-foreground">
            <span>
              Created {todo.createdAt.toLocaleDateString()}
            </span>
            
            <div className="flex ml-auto gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-destructive hover:text-destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <TodoEditDialog 
        todo={todo} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
      />
      
      <TodoDeleteDialog 
        todoId={todo.id}
        todoTitle={todo.title}
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
      />
    </div>
  );
}