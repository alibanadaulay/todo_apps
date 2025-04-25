"use client";

import { useState } from "react";
import { ListTodo, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodoFilters } from "@/lib/types";
import { useTodo } from "@/context/todo-context";
import { TodoAddDialog } from "@/components/todo/todo-add-dialog";
import { TodoFilterDialog } from "@/components/todo/todo-filter-dialog";

export function TodoHeader() {
  const { todos } = useTodo();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <ListTodo className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Todo List</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => setFilterDialogOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          
          <Button 
            onClick={() => setAddDialogOpen(true)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Todo</span>
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 bg-card rounded-lg border shadow-sm">
        <div className="text-sm text-muted-foreground">
          {todos.length === 0 ? (
            <span>No todos yet. Add your first one!</span>
          ) : (
            <span>
              {todos.length} total, {activeTodos} active, {completedTodos} completed
            </span>
          )}
        </div>
      </div>
      
      <TodoAddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <TodoFilterDialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen} />
    </div>
  );
}