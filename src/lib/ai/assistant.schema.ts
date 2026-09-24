import { z } from "zod";

export const ASSISTANT_MAX_TURNS = 16;
export const ASSISTANT_MAX_MESSAGE_CHARS = 1200;

export const AssistantRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .trim()
          .min(1)
          .max(ASSISTANT_MAX_MESSAGE_CHARS * 2),
      }),
    )
    .min(1)
    .max(ASSISTANT_MAX_TURNS),
  path: z.string().trim().max(200).optional(),
});

export type AssistantRequest = z.infer<typeof AssistantRequestSchema>;
