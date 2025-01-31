import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";

import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";

import { Card } from "~/components/Cards/Card";
import { SurfaceCardBase } from "~/components/Cards/SurfaceCards/SurfaceCardBase";
import { Dropdown } from "~/components/Dropdown";
import { ExpandableContent } from "~/components/ExpandableContent";
import type { DetailsLayoutProps } from "~/components/Layouts/DetailsLayout";
import { DetailsLayout } from "~/components/Layouts/DetailsLayout";
import { api } from "~/api-client";
import { formatBytes, hexStringToUtf8 } from "~/utils";

export const BlobTxBytesPerFieldElement = 32; // Size in bytes of a field element
export const BlobTxFieldElementsPerBlob = 4096;
export const BLOB_SIZE =
  BlobTxBytesPerFieldElement * BlobTxFieldElementsPerBlob;

type BlobViewMode = "Original" | "UTF-8" | "Image";

function _getBytes(value: any, copy: any) {
  if (value instanceof Uint8Array) {
    if (copy) {
      return new Uint8Array(value);
    }
    return value;
  }

  if (typeof value === "string" && value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
    const result = new Uint8Array((value.length - 2) / 2);
    let offset = 2;
    for (let i = 0; i < result.length; i++) {
      result[i] = parseInt(value.substring(offset, offset + 2), 16);
      offset += 2;
    }
    return result;
  }
  return undefined;
}

function getBytes(value: any) {
  return _getBytes(value, false);
}

function DecodeBlob(blob: any) {
  if (!blob) {
    throw Error("invalid blob data");
  }

  blob = getBytes(blob);
  if (blob.length < BLOB_SIZE) {
    const newBlob = new Uint8Array(BLOB_SIZE).fill(0);
    newBlob.set(blob);
    blob = newBlob;
  }

  let data: string | any[] = [];
  let j = 0;
  for (let i = 0; i < BlobTxFieldElementsPerBlob; i++) {
    const chunk = blob.slice(j + 1, j + 32);
    data = [...data, ...chunk];
    j += 32;
  }
  let i = data.length - 1;
  for (; i >= 0; i--) {
    if (data[i] !== 0x00) {
      break;
    }
  }
  const newData = data.slice(0, i + 1);
  return newData;
}
function DecodeBlobs(blobs: any) {
  if (!blobs) {
    throw Error("invalid blobs");
  }

  blobs = getBytes(blobs);
  const len = blobs.length;
  if (len === 0) {
    throw Error("invalid blobs");
  }

  let buf: any = [];
  for (let i = 0; i < len; i += BLOB_SIZE) {
    let max = i + BLOB_SIZE;
    if (max > len) {
      max = len;
    }
    const blob = blobs.slice(i, max);
    const blobBuf = DecodeBlob(blob);
    buf = [...buf, ...blobBuf];
  }
  return Buffer.from(buf);
}

const BlobView: NextPage = function () {
  const router = useRouter();
  const [inputData, setInputData] = useState<any>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const versionedHash = (router.query.hash as string | undefined) ?? "0";
  const {
    data: blob,
    error,
    isLoading,
  } = api.blob.getByVersionedHash.useQuery(
    {
      versionedHash,
    },
    {
      enabled: router.isReady,
    }
  );
  const viewMap: { [k: string]: ReactNode } = useMemo(() => {
    let utf8 = "";
    try {
      utf8 = hexStringToUtf8(blob?.data || "0x");
    } catch (error) {
      utf8 = DecodeBlobs(blob?.data || "0x").toString("utf-8");
    }
    const map: any = {
      Original: blob?.data || "",
      // "UTF-8": utf8,
    };

    const types = ((inputData as any[]) || [])
      .filter((item) => !!item && !!item.input_data && item.input_data !== "0x")
      .map((item) => {
        try {
          const meta = ethers.utils.toUtf8String(
            ethers.utils?.arrayify(item?.input_data)
          );
          const index = item?.index;

          const mineType = JSON.parse(meta).blobs[index].content_type;
          return mineType;
        } catch (error) {
          return null;
        }
      });

    const ImageType = types.find(
      (item) => item && (item as string).startsWith("image/")
    );
    const textType = types.find(
      (item) => item && (item as string).startsWith("text/plain")
    );

    if (textType && blob?.data) {
      map["UTF-8"] = DecodeBlobs(blob?.data || "0x").toString("utf-8");
    }
    if (
      blob?.data &&
      ImageType &&
      [
        "image/png",
        "image/svg",
        "image/jpeg",
        "image/gif",
        "image/svg+xml",
      ].includes(ImageType)
    ) {
      const blobs = new Blob([DecodeBlobs(blob.data as any)], {
        type: ImageType,
      });
      map["Image"] = <img src={URL.createObjectURL(blobs)}></img>;
    }
    return map;
  }, [inputData, blob?.data]);

  const [selectedBlobViewMode, setSelectedBlobViewMode] =
    useState<BlobViewMode>("Original");

  const trans = async () => {
    if (!blob) return;
    try {
      const res = await axios(
        `https://blobscan-testnet.ethda.io/backend/blob/${blob?.versionedHash}/txData`
      );
      setInputData(res.data);
    } catch (e) {
      console.error("error", e);
    }
  };

  useEffect(() => {
    trans();
  }, [blob?.versionedHash]);

  if (error) {
    return (
      <NextError
        title={error.message}
        statusCode={error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!blob && !isLoading) {
    return <>Blob not found</>;
  }

  const swarmHash = blob?.dataStorageReferences.find(
    (ref) => ref.blobStorage === "SWARM"
  )?.dataReference;

  const detailsFields: DetailsLayoutProps["fields"] = [];

  if (blob) {
    detailsFields.push(
      { name: "Versioned Hash", value: blob.versionedHash },
      { name: "Commitment", value: blob.commitment },
      { name: "Size", value: formatBytes(blob.size) }
    );

    if (swarmHash) {
      detailsFields.push({
        name: "Swarm Hash",
        value: swarmHash,
      });
    }
  }

  const AlertMessage = ({ message }: any) => {
    return (
      <div className="alert">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <>
      <DetailsLayout
        header="Blob Details"
        fields={blob ? detailsFields : undefined}
      />

      <Card
        header={
          <div className="flex items-center justify-between">
            Data
            <div className="flex items-center gap-2">
              <div className="text-sm font-normal text-contentSecondary-light dark:text-contentSecondary-dark">
                View as:
              </div>
              <Dropdown
                items={Object.keys(viewMap)}
                selected={selectedBlobViewMode}
                onChange={(newViewMode) =>
                  setSelectedBlobViewMode(newViewMode as BlobViewMode)
                }
              />
            </div>
          </div>
        }
      >
        <SurfaceCardBase truncateText={false}>
          {isLoading ? (
            <Skeleton count={10} />
          ) : (
            <div className="t break-words p-3 text-left text-sm leading-7">
              <ExpandableContent type={selectedBlobViewMode}>
                {viewMap[selectedBlobViewMode]}
              </ExpandableContent>
            </div>
          )}
        </SurfaceCardBase>
      </Card>
      {showAlert && <AlertMessage message={alertMessage} />}
    </>
  );
};

export default BlobView;
