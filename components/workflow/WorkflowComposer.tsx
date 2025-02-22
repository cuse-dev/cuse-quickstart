'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import type { KeychainItem } from '../../types/keychain';
import { workflowStore, type WorkflowStep } from '../../lib/store/workflow';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';

interface WorkflowData {
  name: string;
  steps: WorkflowStep[];
  keychainItems: KeychainItem[];
}

const KEYCHAIN_FIELDS = [
  'service',
  'username',
  'password',
  'token',
  'email',
  'phone',
] as const;
type KeychainField = (typeof KEYCHAIN_FIELDS)[number];

export function WorkflowComposer() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    name: '',
    steps: [],
    keychainItems: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const addStep = () => {
    setWorkflowData((prev) => ({
      ...prev,
      steps: [...prev.steps, { id: crypto.randomUUID(), description: '' }],
    }));
  };

  const removeStep = (id: string) => {
    setWorkflowData((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== id),
    }));
  };

  const updateStep = (id: string, description: string) => {
    setWorkflowData((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === id ? { ...step, description } : step
      ),
    }));
  };

  const addKeychainItem = () => {
    setWorkflowData((prev) => ({
      ...prev,
      keychainItems: [
        ...prev.keychainItems,
        {
          service: '',
          username: '',
          password: '',
          token: '',
          email: '',
          phone: '',
        },
      ],
    }));
  };

  const removeKeychainItem = (index: number) => {
    setWorkflowData((prev) => ({
      ...prev,
      keychainItems: prev.keychainItems.filter((_, i) => i !== index),
    }));
  };

  const updateKeychainItem = (
    index: number,
    field: keyof KeychainItem,
    value: string
  ) => {
    setWorkflowData((prev) => ({
      ...prev,
      keychainItems: prev.keychainItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleCreateWorkflow = async () => {
    try {
      setIsSaving(true);
      const savedWorkflow = await workflowStore.saveWorkflow(workflowData);
      console.log('Workflow saved:', savedWorkflow);
      toast({
        title: 'Success',
        description: 'Workflow and credentials saved successfully.',
      });
      router.push('/dashboard/workflows');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: 'Error',
        description:
          'Failed to save workflow and credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return workflowData.name.trim() !== '' && workflowData.steps.length > 0;
      case 2:
        return (
          workflowData.keychainItems.length > 0 &&
          workflowData.keychainItems.every((item) => item.service.trim() !== '')
        );
      default:
        return true;
    }
  };

  const canProceed = isStepValid(currentStep);

  return (
    <div className="space-y-6">
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWorkflowData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter workflow name"
            />
          </div>

          <div className="space-y-2">
            <Label>Workflow Steps</Label>
            {workflowData.steps.map((step, index) => (
              <div key={step.id} className="flex gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                  {index + 1}
                </div>
                <Input
                  value={step.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateStep(step.id, e.target.value)
                  }
                  placeholder={`Step ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(step.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addStep} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Step
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <Label>Keychain Configuration</Label>
          {workflowData.keychainItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Credential Set {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeKeychainItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {KEYCHAIN_FIELDS.map((field) => (
                  <div key={field}>
                    <Label htmlFor={`${field}-${index}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {field === 'service' && ' *'}
                    </Label>
                    <Input
                      id={`${field}-${index}`}
                      type={field === 'password' ? 'password' : 'text'}
                      value={item[field] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateKeychainItem(index, field, e.target.value)
                      }
                      placeholder={`Enter ${field}`}
                      required={field === 'service'}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={addKeychainItem}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Credentials
          </Button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Review Workflow</h3>

          <div className="space-y-2">
            <Label>Workflow Name</Label>
            <p className="text-muted-foreground">{workflowData.name}</p>
          </div>

          <div className="space-y-2">
            <Label>Steps</Label>
            {workflowData.steps.map((step, index) => (
              <div key={step.id} className="flex gap-2 items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                  {index + 1}
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Keychain Items</Label>
            {workflowData.keychainItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">
                    {item.service} (Credential Set {index + 1})
                  </h4>
                  {KEYCHAIN_FIELDS.map(
                    (field) =>
                      field !== 'service' &&
                      item[field] && (
                        <div key={field} className="flex gap-2">
                          <span className="font-medium">{field}:</span>
                          <span className="text-muted-foreground">
                            {field === 'password' ? '••••••••' : item[field]}
                          </span>
                        </div>
                      )
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleCreateWorkflow}
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? 'Creating Workflow...' : 'Create Workflow'}
          </Button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <Button onClick={prevStep} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
        )}
        {currentStep < 3 && (
          <Button onClick={nextStep} className="ml-auto" disabled={!canProceed}>
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
