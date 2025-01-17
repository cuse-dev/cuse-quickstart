import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface UserMessageProps {
  content: string;
  file?: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content, file }) => {
  return (
    <div className="flex justify-end mb-4">
      <Card>
        <CardContent className="p-3">
          <ReactMarkdown className="prose dark:prose-invert max-w-none text-sm text-foreground">
            {content}
          </ReactMarkdown>
          {file && (
            <div className="mt-2 p-2 rounded-md flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              <span className="text-sm">{file}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMessage;
