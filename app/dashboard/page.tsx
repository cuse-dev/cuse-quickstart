import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowComposer } from "@/components/workflow/WorkflowComposer";

export default function DashboardPage() {
	return (
		<div className="container mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle>Workflow Composer</CardTitle>
				</CardHeader>
				<CardContent>
					<WorkflowComposer />
				</CardContent>
			</Card>
		</div>
	);
}
