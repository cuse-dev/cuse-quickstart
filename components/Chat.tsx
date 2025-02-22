"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";

function ChatContent() {
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		reload,
		setInput,
		append,
	} = useChat();
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const promptFromUrl = searchParams.get("prompt");

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	});

	// Handle URL prompt on client-side only
	useEffect(() => {
		if (promptFromUrl) {
			setTimeout(() => {
				append({
					role: "user",
					content: promptFromUrl,
				});
			}, 1000);
		}
	}, [promptFromUrl, append]);

	return (
		<div className=" w-full h-full p-2">
			<div className="flex flex-col bg-slate-300/10 p-2 h-full w-full">
				<div ref={chatContainerRef} className="flex-1 mb-4 overflow-y-auto">
					{messages.map((message) =>
						message.role === "user" ? (
							<UserMessage key={message.id} content={message.content} />
						) : (
							<AIMessage
								key={message.id}
								content={message.content}
								toolInvocations={message.toolInvocations}
								onCopy={() => navigator.clipboard.writeText(message.content)}
								onRegenerate={reload}
							/>
						),
					)}
				</div>
				<form onSubmit={handleSubmit} className="relative border">
					<Textarea
						value={input}
						onChange={handleInputChange}
						placeholder="Type your message..."
						className="min-h-[100px] pr-20"
						onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(
									e.nativeEvent as unknown as React.FormEvent<HTMLFormElement>,
								);
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

export default function Chat() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ChatContent />
		</Suspense>
	);
}
