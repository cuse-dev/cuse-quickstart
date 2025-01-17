import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

interface ToolMessageProps {
  content: string;
}

const ToolMessage: React.FC<ToolMessageProps> = ({ content }) => {
  return (
    <div className="mb-4">
      <Card>
        <CardContent className="p-3 flex items-center space-x-2">
          <Wrench className="w-4 h-4" />
          <span className="text-sm">{content}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolMessage;
