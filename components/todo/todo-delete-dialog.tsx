"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTodo } from "@/context/todo-context";

type TodoDeleteDialogProps = {
  todoId: string;
  todoTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TodoDeleteDialog({
  todoId,
  todoTitle,
  open,
  onOpenChange,
}: TodoDeleteDialogProps) {
  const { deleteTodo } = useTodo();

  const handleDelete = async () => {
    try {
      await deleteTodo(todoId);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the todo "{todoTitle}" and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}