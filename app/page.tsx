"use client";

import { useEffect } from "react";
import { TodoList } from "@/components/todo/todo-list";
import { TodoHeader } from "@/components/todo/todo-header";
import { TodoProvider } from "@/context/todo-context";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TodoProvider>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <TodoHeader />
          <TodoList />
        </div>
        <Toaster position="top-right" />
      </TodoProvider>
    </main>
  );
}