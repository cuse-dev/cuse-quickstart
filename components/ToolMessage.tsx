import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import type { ToolInvocation } from "ai";
import { Wrench } from "lucide-react";
import type React from "react";

interface ToolMessageProps {
	toolCall: ToolInvocation;
}

const ToolMessage: React.FC<ToolMessageProps> = ({ toolCall }) => {
	const toolName = toolCall.toolName;
	const toolArgs = toolCall.args;

	const getScreenshotData = () => {
		if (toolArgs.action === "screenshot" && toolCall.state === "result") {
			const base64 = toolCall.result.image;
			const image = `data:image/png;base64,${base64}`;
			return image;
		}
	};

	return (
		<div className="mb-4">
			<Card className="rounded-none">
				<CardContent className="p-3 flex flex-col items-start content-start space-y-2">
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1" className="border-none">
							<AccordionTrigger className="p-0">
								<div className="flex items-center">
									<Wrench className="w-4 h-4 mr-2" />
									{toolArgs.action
										? `${toolName}: ${toolArgs.action}`
										: toolName}
								</div>
							</AccordionTrigger>
							<AccordionContent className="max-w-full">
								{toolCall.state === "result" ? (
									<div className="flex flex-col gap-2">
										<div>
											<p className="text-sm text-muted-foreground p-2">
												Input: {JSON.stringify(toolCall.args, null, 2)}
											</p>
										</div>
										<div>
											{getScreenshotData() ? (
												<img
													src={getScreenshotData()}
													alt="Screenshot"
													className="w-full h-auto mt-4"
												/>
											) : (
												<p className="text-sm p-2">
													Output: {JSON.stringify(toolCall.result, null, 2)}
												</p>
											)}
										</div>
									</div>
								) : (
									<div>Loading...</div>
								)}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
};

export default ToolMessage;
