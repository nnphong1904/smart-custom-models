import { z } from "zod";

export const modelFormSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  supportPlugins: z.boolean().default(false),
  supportVision: z.boolean().default(false),
  supportSystem: z.boolean().default(false),
  supportStreaming: z.boolean().default(false),
  headers: z
    .array(
      z.object({
        key: z.string().min(1, "Header key is required"),
        value: z.string().min(1, "Header value is required"),
      }),
    )
    .default([]),
  bodyParams: z
    .array(
      z.object({
        type: z.enum(["string", "number", "boolean", "object"]),
        key: z.string().min(1, "Parameter key is required"),
        value: z.string().min(1, "Parameter value is required"),
      }),
    )
    .default([]),
});

export type ModelFormData = z.infer<typeof modelFormSchema>;
