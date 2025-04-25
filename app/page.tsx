"use client";

import { useEffect } from "react";
import { TodoList } from "@/components/todo/todo-list";
import { TodoHeader } from "@/components/todo/todo-header";
import { TodoProvider } from "@/context/todo-context";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-8">
      <TodoProvider>
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
          <div className="max-w-3xl mx-auto mb-8">
            <TodoHeader />
          </div>
          <TodoList />
        </div>
        <Toaster position="bottom-right" />
      </TodoProvider>
    </main>
  );
}