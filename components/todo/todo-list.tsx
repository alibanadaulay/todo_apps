"use client";

import { useTodo } from "@/context/todo-context";
import { TodoItem } from "@/components/todo/todo-item";
import { filterTodos } from "@/lib/todo-utils";
import { Inbox } from "lucide-react";

export function TodoList() {
  const { todos, filters } = useTodo();
  
  const filteredTodos = filterTodos(todos, filters);
  
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No todos yet</h3>
        <p className="text-muted-foreground mb-4">
          Add your first todo to get started
        </p>
      </div>
    );
  }
  
  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No matching todos</h3>
        <p className="text-muted-foreground mb-4">
          Try changing your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}