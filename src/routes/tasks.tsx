import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTasks, useCreateTask } from '@/hooks/use-tasks';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TaskFilter, TaskInput } from '@/lib/types';

export const Route = createFileRoute('/tasks')({
  component: TasksComponent,
});

function TasksComponent() {
  const { data: tasks = [], isLoading } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createTask = useCreateTask();

  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    tags: [],
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating task with data:', formData);
    createTask.mutate(formData, {
      onSuccess: (data) => {
        console.log('Task created successfully:', data);
        setIsDialogOpen(false);
        setFormData({
          title: '',
          description: '',
          completed: false,
          priority: 'medium',
          tags: [],
        });
      },
      onError: (error) => {
        console.error('Error creating task - Full error object:', error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));

        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          errorMessage = error.message;
          console.error('Error stack:', error.stack);
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object') {
          errorMessage = JSON.stringify(error);
        }

        alert(`Failed to create task: ${errorMessage}`);
      },
    });
  };

  if (isLoading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your list. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? 'Creating...' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Active ({tasks.filter(t => !t.completed).length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter(t => t.completed).length})
        </Button>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No tasks found. Create your first task!
        </div>
      )}

      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div key={task.id} className="p-4 border rounded-lg">
            <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
