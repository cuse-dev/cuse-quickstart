import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ToolInvocation } from 'ai';
import ToolMessage from './ToolMessage';

interface AIMessageProps {
  content: string;
  toolInvocations: ToolInvocation[] | undefined;
  onCopy: () => void;
  onRegenerate: () => void;
}

const AIMessage: React.FC<AIMessageProps> = ({
  content,
  toolInvocations,
  onCopy,
  onRegenerate,
}) => {
  return (
    <div className="mb-4">
      <div className="rounded-lg max-w-[80%]">
        <ReactMarkdown className="prose dark:prose-invert max-w-none text-sm text-foreground">
          {content}
        </ReactMarkdown>
      </div>
      <div className="flex flex-col w-fit mt-4">
        {toolInvocations
          ?.filter((toolInvocation) => toolInvocation.state == 'result')
          .map((toolInvocation) => (
            <ToolMessage
              key={toolInvocation.toolCallId}
              content={
                typeof toolInvocation.result == 'string'
                  ? toolInvocation.result
                  : 'Took screenshot'
              }
            />
          ))}
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRegenerate}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIMessage;
