"use client";

import { useState } from "react";
import { Todo } from "@/lib/types";
import { useTodo } from "@/context/todo-context";
import { Pencil, Trash2, Clock, Calendar } from "lucide-react";
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
    <div className="todo-card group">
      <div 
        className={cn(
          "h-full p-4 rounded-lg border bg-card transition-all",
          "hover:border-primary/50",
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
                  "text-sm mt-1 text-muted-foreground line-clamp-2",
                  todo.completed && "line-through"
                )}
              >
                {todo.description}
              </p>
            )}

            {todo.imageUrl && (
              <div className="relative w-full aspect-video mt-3 rounded-md overflow-hidden bg-muted">
                <Image
                  src={todo.imageUrl}
                  alt={`${todo.title} image`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDueDate(todo.dueDate)}</span>
              </div>
              
              {recurringText && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{recurringText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-3 pt-3 border-t gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setEditDialogOpen(true)}
            className="h-8"
          >
            <Pencil className="h-3.5 w-3.5 mr-2" />
            Edit
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="h-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "priority-indicator",
        todo.priority === "low" && "priority-low",
        todo.priority === "medium" && "priority-medium",
        todo.priority === "high" && "priority-high"
      )} />
      
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