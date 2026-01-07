import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Tag, FolderOpen } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Task Tracker</h1>
        <p className="text-muted-foreground text-lg">
          A modern, efficient task management application built with Tauri and React
        </p>
        <Link to="/tasks">
          <Button size="lg" className="mt-4">
            Get Started
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create, organize, and track your tasks with ease. Mark tasks as complete and manage priorities.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Organize tasks into custom categories with color coding for better visual organization.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Tag your tasks for flexible filtering and grouping. Create tags on the fly as you need them.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
