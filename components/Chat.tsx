'use client';

import { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className=" w-full h-full p-2">
      <div className="flex flex-col bg-slate-300/10 rounded-xl p-2 h-full w-full">
        <div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto">
          {messages.map((message) =>
            message.role === 'user' ? (
              <UserMessage key={message.id} content={message.content} />
            ) : (
              <AIMessage
                key={message.id}
                content={message.content}
                toolInvocations={message.toolInvocations}
                onCopy={() => navigator.clipboard.writeText(message.content)}
                onRegenerate={reload}
              />
            )
          )}
        </div>
        <form onSubmit={handleSubmit} className="relative border rounded-lg">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="min-h-[100px] pr-20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 bottom-2"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
