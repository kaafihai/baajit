import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useToggleTask } from '@/hooks/use-tasks';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();

  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    tags: [],
    dueDate: '',
  });

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .sort((a, b) => {
      // In 'all' view, show non-completed tasks first
      if (filter === 'all') {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      }
      return 0;
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating task with data:', formData);
    createTask.mutate(formData, {
      onSuccess: (data) => {
        console.log('Task created successfully:', data);
        setIsCreateDialogOpen(false);
        setFormData({
          title: '',
          description: '',
          completed: false,
          priority: 'medium',
          tags: [],
          dueDate: '',
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

  const handleEditClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      // Format dueDate to YYYY-MM-DD if it exists, otherwise empty string
      const formattedDueDate = task.dueDate
        ? task.dueDate.split('T')[0] // Extract date part if ISO format
        : '';
      setFormData({
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        tags: task.tags,
        category: task.category,
        dueDate: formattedDueDate,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;

    console.log('Updating task with data:', formData);
    updateTask.mutate(
      { id: selectedTaskId, updates: formData },
      {
        onSuccess: (data) => {
          console.log('Task updated successfully:', data);
          setIsEditDialogOpen(false);
          setSelectedTaskId(null);
          setFormData({
            title: '',
            description: '',
            completed: false,
            priority: 'medium',
            tags: [],
            dueDate: '',
          });
        },
        onError: (error) => {
          console.error('Error updating task:', error);
          let errorMessage = 'Unknown error';
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          } else if (error && typeof error === 'object') {
            errorMessage = JSON.stringify(error);
          }
          alert(`Failed to update task: ${errorMessage}`);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Tasks</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your list. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
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
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate && formData.dueDate.trim() !== '' ? formData.dueDate : undefined}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, dueDate: value || '' });
                      }}
                      className="pr-10"
                      onBlur={(e) => {
                        // Allow clicking outside to close the native picker
                        e.target.blur();
                      }}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {formData.dueDate && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, dueDate: '' })}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {!formData.dueDate && (
                  <p className="text-xs text-muted-foreground">No due date set</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
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

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Task description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Due Date (Optional)</Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      id="edit-dueDate"
                      type="date"
                      value={formData.dueDate && formData.dueDate.trim() !== '' ? formData.dueDate : undefined}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, dueDate: value || '' });
                      }}
                      className="pr-10"
                      onBlur={(e) => {
                        // Allow clicking outside to close the native picker
                        e.target.blur();
                      }}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {formData.dueDate && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, dueDate: '' })}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {!formData.dueDate && (
                  <p className="text-xs text-muted-foreground">No due date set</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTask.isPending}>
                {updateTask.isPending ? 'Saving...' : 'Save Changes'}
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
          <div
            key={task.id}
            className={`p-4 border rounded-lg transition-colors ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask.mutate(task)}
                className="mt-1 cursor-pointer"
              />
              <div
                className="flex-1 cursor-pointer hover:opacity-80"
                onClick={() => handleEditClick(task.id)}
              >
                <div className="flex justify-between items-start">
                  <h3
                    className={`font-semibold ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground ml-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p
                    className={`text-sm mt-1 ${
                      task.completed
                        ? 'text-muted-foreground line-through'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
