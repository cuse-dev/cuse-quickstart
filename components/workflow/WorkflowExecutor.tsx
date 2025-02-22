"use client";

import { cn } from "@/lib/utils";
import type { Message as AIMessage } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import type { Workflow } from "../../lib/store/workflow";

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

interface WorkflowExecutorProps {
	workflow: Workflow;
	isExecuting: boolean;
	onComplete: () => void;
	onError: (error: Error) => void;
	onMessage: (message: Message) => void;
}

export function WorkflowExecutor({
	workflow,
	isExecuting,
	onMessage,
}: WorkflowExecutorProps) {
	const [currentStepIndex, setCurrentStepIndex] = useState(-1);
	const { messages, setMessages, append, isLoading, stop } = useChat({});

	useEffect(() => {
		if (isExecuting && !isLoading) {
			executeWorkflow();
		} else if (!isExecuting && isLoading) {
			stop();
		}
	}, [isExecuting]);

	const executeWorkflow = async () => {
		setMessages([]);
		setCurrentStepIndex(0);

		const steps = workflow.steps
			.map((step) => `subtask_id: ${step.id}: ${step.description}`)
			.join("\n");
		const prompt = `Execute the following workflow:\n${steps}\n\nApproach each step with a plan. Think step by step and reason about the actions you need to take before executing the next actions. If something goes wrong, try to fix it yourself or try another approach. Don't give up.

PROCESS HINTS:
1. Open Libre Office Calc.
2. Open the contacts.ods file using the open file dialog (ctrl+o). Read the complete row of the first contact.
3. Use firefox to open Hubspot at: https://app.hubspot.com/contacts/49253034/objects/0-1/views/all/list
4. Create a new contact in hubspot.
  - Important: Analyze the form via screenshot before you continue and think about the correct inputs for ALL fields in the create contact form (make sure to skip the contact owner field). Fill in the contact details one by one. Some of the fields might open dropdowns or other elements, handle them correctly.
  - When putting the phone number, use the keyboard to type the number and click on apply to update the phone number.
  - Save the contact.
5. If you need to navigate between applications, you can use alt+tab to switch between applications. Validate your actions by reading the screen.`;

		const result = await append({
			role: "user",
			content: prompt,
		});

		console.log("result", result);

		await append({
			role: "user",
			content: "continue. Or 'done' if the workflow is complete.",
		});

		console.log("result", result);
	};

	useEffect(() => {
		console.log("messages", messages);

		const message = messages[messages.length - 1] as Message;
		if (
			message &&
			message.toolInvocations &&
			message.toolInvocations.length > 0 &&
			message.toolInvocations[0].toolName === "start_subtask"
		) {
			const subtaskId = message.toolInvocations[0].args.id;
			console.log("subtaskId", subtaskId);
			const subtaskIndex = workflow.steps.findIndex(
				(step) => step.id === subtaskId,
			);
			setCurrentStepIndex(subtaskIndex);
		}

		if (messages.length > 0) {
			onMessage(messages[messages.length - 1] as Message);
		}
	}, [messages]);

	return (
		<div className="space-y-4">
			{workflow.steps.map((step, index) => (
				<div
					key={step.id}
					className={cn(
						"flex flex-col gap-2 p-4 rounded-lg border transition-colors",
						currentStepIndex === index && "bg-primary/10 border-primary",
						currentStepIndex > index && "bg-muted/50",
					)}
				>
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"w-8 h-8 flex items-center justify-center rounded-full",
								currentStepIndex === index &&
									"bg-primary text-primary-foreground",
								currentStepIndex > index ? "bg-muted" : "bg-muted",
							)}
						>
							{index + 1}
						</div>
						<p
							className={cn(
								"flex-1",
								currentStepIndex === index
									? "font-medium"
									: "text-muted-foreground",
							)}
						>
							{step.description}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
