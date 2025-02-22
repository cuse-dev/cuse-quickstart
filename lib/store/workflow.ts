import { saveKeychainItems } from '../../app/actions/keychain';
import type { KeychainItem } from '../../types/keychain';

export interface WorkflowStep {
  id: string;
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  keychainItems: KeychainItem[];
  createdAt: string;
  updatedAt: string;
}

class WorkflowStore {
  private static instance: WorkflowStore;
  private storageKey = 'cuse-workflows';

  private constructor() {}

  static getInstance(): WorkflowStore {
    if (!WorkflowStore.instance) {
      WorkflowStore.instance = new WorkflowStore();
    }
    return WorkflowStore.instance;
  }

  async saveWorkflow(
    workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Workflow> {
    const workflows = await this.getAllWorkflows();

    const newWorkflow: Workflow = {
      ...workflow,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save keychain items to the computer
    const keychainResult = await saveKeychainItems(workflow.keychainItems);
    if (!keychainResult.success) {
      throw new Error('Failed to save keychain items');
    }

    workflows.push(newWorkflow);
    await this.saveToStorage(workflows);

    return newWorkflow;
  }

  async updateWorkflow(
    id: string,
    workflow: Partial<Omit<Workflow, 'id' | 'createdAt'>>
  ): Promise<Workflow | null> {
    const workflows = await this.getAllWorkflows();
    const index = workflows.findIndex((w) => w.id === id);

    if (index === -1) return null;

    // If keychain items are being updated, save them to the computer
    if (workflow.keychainItems) {
      const keychainResult = await saveKeychainItems(workflow.keychainItems);
      if (!keychainResult.success) {
        throw new Error('Failed to save keychain items');
      }
    }

    const updatedWorkflow: Workflow = {
      ...workflows[index],
      ...workflow,
      updatedAt: new Date().toISOString(),
    };

    workflows[index] = updatedWorkflow;
    await this.saveToStorage(workflows);

    return updatedWorkflow;
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    const workflows = await this.getAllWorkflows();
    return workflows.find((w) => w.id === id) || null;
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading workflows:', error);
      return [];
    }
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const workflows = await this.getAllWorkflows();
    const filteredWorkflows = workflows.filter((w) => w.id !== id);

    if (filteredWorkflows.length === workflows.length) {
      return false;
    }

    await this.saveToStorage(filteredWorkflows);
    return true;
  }

  private async saveToStorage(workflows: Workflow[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(workflows));
    } catch (error) {
      console.error('Error saving workflows:', error);
      throw new Error('Failed to save workflows');
    }
  }
}

export const workflowStore = WorkflowStore.getInstance();
