import { anthropic } from '@ai-sdk/anthropic';
import { toolsets } from '@cusedev/core';
import { type LanguageModelV1, streamText, tool } from 'ai';
import { z } from 'zod';
import { initComputer } from '../../../lib/computer';
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const system = `You are RechnerAI, an intelligent Ubuntu-based computer agent running on an x86_64 architecture. Your purpose is to assist users with computer tasks while maintaining system integrity and security. You operate with full understanding of the Ubuntu environment and its capabilities.

## Core Operating Principles:

1. Autonomous Problem-Solving
  - Take full responsibility for task completion
  - Utilize creative problem-solving within system constraints
  - Log your thought process before taking action
  - Handle errors and dead ends with appropriate recovery strategies

2. System Interaction Protocol:
  For each computer task, follow this systematic approach:

  a) Initial Analysis
  - Document your chain of thought reasoning
  - Break down complex tasks into manageable steps
  - Plan your approach before taking action

  b) Interface Recognition
  - Analyze the current UI state
  - Identify relevant UI elements and their functions
  - Map possible navigation and interaction paths

  c) Action Execution
  - Take precise, deliberate actions
  - Maintain awareness of system state at all times

  d) Validation
  - Verify successful completion of each step
  - Ensure desired outcome is achieved

3. Security and Authentication:
  - Use the keychain tool for all authentication processes
  - Guide users through secure login procedures

## Navigation and Control:
  - Use standard Ubuntu desktop navigation patterns
  - Implement keyboard shortcuts when appropriate
  - Follow window management best practices
  - Maintain consistent interaction patterns
  - Document navigation paths taken

## Window & Application Management
  - Track active window & application states
  - Handle multiple open applications effectively
  - Maintain awareness of opened tabs and windows (dock)

## When executing tasks:
1. Begin with clear task understanding
2. Document your reasoning process
3. Plan your approach
4. Execute with precision
5. Validate results

## Automated Proactive Error Recovery:
1. Detect error conditions
2. Analyze error context
3. Develop recovery strategy
4. Execute recovery steps
5. Validate recovery success

## IMPORTANT:
- You are an autonomous agent
- Take responsibility for task completion
- Log your progress using the start_subtask tool`;

  const computer = await initComputer();

  //const services = computer.apps.keychain.services.map((service) => service);
  //const servicesEnum = z.enum(services as [string, ...string[]]);

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest') as LanguageModelV1,
    messages: [
      {
        role: 'system',
        content: system,
      },
      ...messages,
    ],

    tools: {
      ...toolsets.aiSdk.anthropic(computer),
      start_subtask: tool({
        description:
          'Use this tool to start working on a specific subtask to log your progress.',
        parameters: z.object({
          id: z.string().describe('The id of the subtask to approach next'),
        }),
        execute: async ({ id }) => {
          return `Acknowledged. You will now approach subtask ${id}.`;
        },
      }),
      wait: tool({
        parameters: z.object({
          seconds: z
            .number()
            .default(1)
            .optional()
            .describe(
              'The number of seconds to wait. One second should be enough in most cases.'
            ),
        }),
        execute: async ({ seconds = 1 }) => {
          await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

          return `Done waiting ${seconds} seconds`;
        },
      }),
      // keychain: tool({
      //   description:
      //     "Request the user to fill in a login form. You can use this tool to authenticate to any of the services in the keychain. Proactively support the user to fill in the form. Help them at every step. Don't forget to take screenshots after each step and navigate to the next step if needed.",
      //   parameters: z.object({
      //     serviceId: servicesEnum,
      //     elements: z
      //       .array(
      //         z.object({
      //           type: z
      //             .enum([
      //               'password',
      //               'email',
      //               'username',
      //               'token',
      //               'phone',
      //               'otp',
      //             ])
      //             .describe('The type of element to be filled in'),
      //           coordinates: z.object({
      //             x: z.number().describe('The x coordinate of the element'),
      //             y: z.number().describe('The y coordinate of the element'),
      //           }),
      //         })
      //       )
      //       .describe('The elements to be filled in'),
      //   }),
      //   execute: async ({ serviceId, elements }) => {
      //     const success = await computer.apps.keychain.authenticate(
      //       serviceId,
      //       elements as AuthElement[]
      //     );

      //     return success
      //       ? 'Form filled in successfully. You can now proceed to the next step.'
      //       : 'Failed to fill in the form. Please try again.';
      //   },
      // }),
    },
    maxSteps: 99,
  });

  return result.toDataStreamResponse();
}
