import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../../procedures";
import { fullBlockSelect } from "./common";
import { getByHashInputSchema } from "./getByHash.schema";

export const getByHash = publicProcedure
  .input(getByHashInputSchema)
  .query(async ({ ctx, input: { hash } }) => {
    const block = await ctx.prisma.block
      .findUnique({
        select: fullBlockSelect,
        where: {
          hash,
        },
      })
      .then((b) =>
        b
          ? {
              ...b,
              blobAsCalldataGasUsed: b.blobAsCalldataGasUsed.toFixed(),
              blobGasUsed: b.blobGasUsed.toFixed(),
              blobGasPrice: b.blobGasPrice.toFixed(),
              excessBlobGas: b.excessBlobGas.toFixed(),
            }
          : null
      );

    if (!block) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No block with hash '${hash}'`,
      });
    }

    return block;
  });
