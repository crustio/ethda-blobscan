import { createEnv, z, presetEnvOptions } from "@blobscan/zod";

export const env = createEnv({
  envOptions: {
    server: {
      REDIS_QUEUE_HOST: z.string().default("localhost"),
      REDIS_QUEUE_PORT: z.coerce.number().default(6379),
      REDIS_QUEUE_PASSWORD: z.string().optional(),
      REDIS_QUEUE_USERNAME: z.string().optional(),
    },

    ...presetEnvOptions,
  },
});
