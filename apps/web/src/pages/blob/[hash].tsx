import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";

import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";

import tra from "~/utils/tra";
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

const BLOB_VIEW_MODES: BlobViewMode[] = ["Original", "UTF-8", "Image"];

const Blob: NextPage = function () {
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
      // console.log(result, result.length);
      return result;
    }
    return undefined;
  }

  function imgRun(value: any) {
    let pos = 0;
    let len = value.length;
    if (len % 2 != 0) {
      return null;
    }
    len /= 2;
    const hex = [];
    for (let i = 0; i < len; i++) {
      const s = value.substr(pos, 2);
      const v = parseInt(s, 16);
      hex.push(v);
      pos += 2;
    }
    let binary = "";
    const bytes: any = new Uint8Array(hex);
    const len2 = bytes.byteLength;
    for (let i = 0; i < len2; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return "data:image/png;base64," + window.btoa(binary);
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

  const transformBlob = (data: any) => {
    const objData = (inputData && inputData[0]) || [];
    const val = ethers.utils.toUtf8String(
      ethers.utils?.arrayify(objData?.input_data)
    );
    const mineType = JSON.parse(val).blobs[objData?.index];

    const da = DecodeBlobs(data);
    console.log("inputData", da);

    console.log("vavalvall", val);

    const blob = tra(da, mineType);
    var img = new Image();

    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
    const targetElement: any = document.getElementById("content");
    console.log("iimgmimgg", img);

    targetElement.appendChild(img);
  };

  const onView = (blob: any, isText = false) => {
    const objData = (inputData && inputData[0]) || [];
    const val = ethers.utils.toUtf8String(
      ethers.utils?.arrayify(objData?.input_data)
    );
    const mineType = JSON.parse(val).blobs[objData?.index];
    console.log("mineType", mineType, JSON.parse(val), objData);

    if (isText) {
      // setAlertMessage("123");
      // setShowAlert(true);
      // setTimeout(() => {
      //   setShowAlert(false);
      // }, 3000);
      return hexStringToUtf8(blob);
    } else {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      transformBlob(blob);
    }
  };

  function formatBlob(blob: string, viewMode: BlobViewMode): any {
    switch (viewMode) {
      case "Original":
        return blob;
      case "UTF-8":
        return onView(blob, true);
      case "Image":
        return onView(blob);
      default:
        return blob;
    }
  }

  const [selectedBlobViewMode, setSelectedBlobViewMode] =
    useState<BlobViewMode>("Original");
  const [formattedData, formattedDataErr] = useMemo(() => {
    const data = blob?.data;
    if (!data) {
      return [""];
    }

    try {
      return [formatBlob(data, selectedBlobViewMode)];
    } catch (err) {
      // eslint-disable-next-line no-sparse-arrays
      return [, "Couldn't format blob data"];
    }
  }, [blob?.data, selectedBlobViewMode]);

  console.log("formattedData", formattedData);

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

  const trans = async () => {
    if (!blob) return;
    try {
      const res = await axios(
        `https://blobscan-devnet.ethda.io/backend/blob/${blob?.versionedHash}/txData`
      );
      console.log("asdasdasdas", res);
      setInputData(res.data);

      // return res.data[0]?.input_data;
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    trans();
  }, [blob?.versionedHash]);

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
                items={BLOB_VIEW_MODES}
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
              {formattedDataErr ? (
                <span className="text-error-400">
                  Couldn&rsquo;t format blob data.
                </span>
              ) : (
                <ExpandableContent>{formattedData}</ExpandableContent>
              )}
            </div>
          )}
        </SurfaceCardBase>
      </Card>
      {showAlert && <AlertMessage message={alertMessage} />}
    </>
  );
};

export default Blob;
