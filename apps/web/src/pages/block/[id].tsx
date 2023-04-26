import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";

import { BlobTransactionCard } from "~/components/Cards/BlobTransactionCard";
import { SectionCard } from "~/components/Cards/SectionCard";
import { DetailsLayout } from "~/components/DetailsLayout";
import { InfoGrid } from "~/components/InfoGrid";
import { Link } from "~/components/Link";
import { PageSpinner } from "~/components/Spinners/PageSpinner";
import { api } from "~/api";
import {
  buildBlockExternalUrl,
  buildSlotExternalUrl,
  formatTimestamp,
} from "~/utils";

function fetchBlock(blockNumberOrHash: string) {
  const blockNumber = Number(blockNumberOrHash);

  if (!Number.isNaN(blockNumber)) {
    return api.block.getByBlockNumber.useQuery({ number: blockNumber });
  }

  return api.block.getByHash.useQuery({ hash: blockNumberOrHash });
}

const Block: NextPage = function () {
  const router = useRouter();
  const id = router.query.id as string;
  const blockQuery = fetchBlock(id);

  if (blockQuery?.error) {
    return (
      <NextError
        title={blockQuery.error.message}
        statusCode={blockQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (blockQuery.status !== "success") {
    return <PageSpinner label="Loading block…" />;
  }

  if (!blockQuery.data) {
    return <div>Block not found</div>;
  }

  const block = blockQuery.data;

  return (
    <>
      <DetailsLayout
        title="Block Details"
        externalLink={buildBlockExternalUrl(block.number)}
      >
        <InfoGrid
          fields={[
            { name: "Block Height", value: block.number },
            { name: "Hash", value: block.hash },
            {
              name: "Timestamp",
              value: (
                <div className="whitespace-break-spaces">
                  {formatTimestamp(block.timestamp)}
                </div>
              ),
            },
            {
              name: "Slot",
              value: (
                <Link href={buildSlotExternalUrl(block.slot)} isExternal>
                  {block.slot}
                </Link>
              ),
            },
          ]}
        />
      </DetailsLayout>
      <SectionCard
        header={<div>Blob Transactions ({block.transactions.length})</div>}
      >
        <div className="space-y-6">
          {block.transactions.map((t) => (
            <BlobTransactionCard key={t.hash} transaction={t} />
          ))}
        </div>
      </SectionCard>
    </>
  );
};

export default Block;
