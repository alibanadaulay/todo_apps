"use client";

import { useTodo } from "@/context/todo-context";
import { TodoItem } from "@/components/todo/todo-item";
import { filterTodos } from "@/lib/todo-utils";
import { Inbox, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TodoList() {
  const { todos, filters } = useTodo();
  
  const filteredTodos = filterTodos(todos, filters);
  
  if (todos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-card/50 backdrop-blur-sm border shadow-sm">
          <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <ListPlus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No todos yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Get started by adding your first todo. Stay organized and track your tasks effectively.
          </p>
          <Button variant="outline" size="lg" className="font-medium">
            Add Your First Todo
          </Button>
        </div>
      </div>
    );
  }
  
  if (filteredTodos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-card/50 backdrop-blur-sm border shadow-sm">
          <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Inbox className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No matching todos</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "todo-grid",
      filteredTodos.length === 1 && "!grid-cols-1 max-w-md mx-auto"
    )}>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}