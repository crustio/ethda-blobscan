import { z, createEnvSchema } from "@blobscan/zod";

const envSchema = createEnvSchema({
  BLOBSCAN_API_PORT: {
    schema: z.coerce.number().int().positive(),
    default: 3001,
  },
  NODE_ENV: {
    schema: z.enum(["development", "test", "production"]),
    optional: true,
  },
});

export const env = envSchema.parse(process.env);

export type Environment = z.infer<typeof envSchema>;
