'use client';

import ToolMessage from '@/components/ToolMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { WorkflowExecutor } from '@/components/workflow/WorkflowExecutor';
import type { Message as AIMessage } from 'ai';
import { ArrowLeft, Play, StopCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { workflowStore, type Workflow } from '../../../lib/store/workflow';

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface Message extends AIMessage {
  function_call?: {
    name: string;
    arguments: string;
  };
  tool_calls?: ToolCall[];
}

export default function ExecuteWorkflowPage() {
  const params = useParams();
  const { toast } = useToast();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadWorkflow();
  }, [params.id]);

  const loadWorkflow = async () => {
    if (!params.id) return;
    const data = await workflowStore.getWorkflow(params.id as string);
    setWorkflow(data);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setMessages([]);
  };

  const handleStop = () => {
    setIsExecuting(false);
    toast({
      title: 'Stopped',
      description: 'Workflow execution stopped.',
    });
  };

  const handleComplete = () => {
    setIsExecuting(false);
    toast({
      title: 'Success',
      description: 'Workflow executed successfully.',
    });
  };

  const handleError = () => {
    setIsExecuting(false);
    toast({
      title: 'Error',
      description: 'Failed to execute workflow. Please try again.',
      variant: 'destructive',
    });
  };

  const handleMessage = (message: Message) => {
    console.log('handleMessage', message);

    setMessages((prev) => [
      ...prev.filter((m) => m.id !== message.id),
      message,
    ]);
  };

  if (!workflow) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Workflow not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{workflow.name}</h1>
        </div>
        {isExecuting ? (
          <Button onClick={handleStop} variant="destructive">
            <StopCircle className="h-4 w-4 mr-2" /> Stop Execution
          </Button>
        ) : (
          <Button onClick={handleExecute}>
            <Play className="h-4 w-4 mr-2" /> Execute Workflow
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowExecutor
                workflow={workflow}
                isExecuting={isExecuting}
                onComplete={handleComplete}
                onError={handleError}
                onMessage={handleMessage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {workflow.keychainItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/10"
                  >
                    <h4 className="font-medium mb-2">
                      {item.service} (Credential Set {index + 1})
                    </h4>
                    <div className="space-y-1">
                      {item.username && (
                        <p className="text-sm text-muted-foreground">
                          Username: {item.username}
                        </p>
                      )}
                      {item.email && (
                        <p className="text-sm text-muted-foreground">
                          Email: {item.email}
                        </p>
                      )}
                      {/* Don't show sensitive information */}
                      {item.password && (
                        <p className="text-sm text-muted-foreground">
                          Password: ••••••••
                        </p>
                      )}
                      {item.token && (
                        <p className="text-sm text-muted-foreground">
                          Token: ••••••••
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-[calc(100vh-12rem)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tool Invocations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)] px-4">
                <div className="space-y-2 pb-4">
                  {messages.map((message) =>
                    message.toolInvocations?.map((tool) => {
                      try {
                        return (
                          <div key={tool.toolCallId}>
                            <ToolMessage toolCall={tool} />
                          </div>
                        );
                      } catch (e) {
                        console.error('Error parsing tool arguments:', e);
                        return null;
                      }
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
