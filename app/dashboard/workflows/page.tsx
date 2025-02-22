'use client';

import { useEffect, useState } from 'react';
import { workflowStore, type Workflow } from '../../../lib/store/workflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    const data = await workflowStore.getAllWorkflows();
    setWorkflows(data);
  };

  const handleDelete = async (id: string) => {
    const success = await workflowStore.deleteWorkflow(id);
    if (success) {
      loadWorkflows();
    }
  };

  const handleExecute = (id: string) => {
    router.push(`/execute/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Link href="/dashboard">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Workflow
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {workflows.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No workflows created yet. Click the button above to create your
                first workflow.
              </p>
            </CardContent>
          </Card>
        ) : (
          workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  {workflow.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExecute(workflow.id)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(workflow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {workflow.steps.length} steps •{' '}
                    {workflow.keychainItems.length} credentials
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(workflow.createdAt)}
                  </p>
                  {workflow.updatedAt !== workflow.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(workflow.updatedAt)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
