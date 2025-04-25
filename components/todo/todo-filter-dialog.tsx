"use client";

import { useTodo } from "@/context/todo-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoFilters } from "@/lib/types";

type TodoFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TodoFilterDialog({ open, onOpenChange }: TodoFilterDialogProps) {
  const { filters, setFilters } = useTodo();
  
  const handleStatusChange = (value: TodoFilters["status"]) => {
    setFilters({ status: value });
  };
  
  const handleSortChange = (value: TodoFilters["sortBy"]) => {
    setFilters({ sortBy: value });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter & Sort</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={handleSortChange}
            >
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}