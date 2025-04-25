"use client";

import { useEffect } from "react";
import { TodoList } from "@/components/todo/todo-list";
import { TodoHeader } from "@/components/todo/todo-header";
import { TodoProvider } from "@/context/todo-context";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-8 flex justify-center">
      <TodoProvider>
        <div className="w-full max-w-[1200px] px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <TodoHeader />
          </div>
          <div className="max-w-7xl mx-auto">
            <TodoList />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </TodoProvider>
    </main>
  );
}