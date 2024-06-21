import React from "react";
import Link from "next/link";

import { ExplorerDetails } from "../ExplorerDetails";
import { DiscordIcon } from "../icons/Discord";
import { GithubIcon } from "../icons/Github";
import { MediumIcon } from "../icons/Medium";
import { TelegramIcon } from "../icons/Telegram";
import { TwitterIcon } from "../icons/Twitter";

export const BottomBarLayout = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-2 mx-auto space-y-4">
        <div className="md:hidden">
          <ExplorerDetails />
        </div>
        <div className="mo:mx-[5px] flex flex-col justify-center  ">
          <span className="text-xs text-center text-contentSecondary-light dark:text-contentSecondary-dark">
            EthDA Blobscan is a fork of Blobscan
          </span>
          <div className="flex-col flex-wrap mo:flex mo:flex-row mo:justify-center ">
            <div className="text-xs text-center text-contentSecondary-light dark:text-contentSecondary-dark">
              Blobscan is the first open-source block explorer for the
              <button
                onClick={() =>
                  window.open("https://www.eip4844.com/", "_blank")
                }
                className="mx-1 text-purple-500"
              >
                EIP-4844
              </button>
              shard blob &nbsp;
            </div>
            <div className="text-xs text-center text-contentSecondary-light dark:text-contentSecondary-dark">
              transactions, providing the necessary infrastructure to scale
              Ethereum.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between mx-10 mt-10 mb-10 ">
        <div className="text-xs mo:flex mo:justify-center mo:text-center mo:w-full mo:flex-col">
          <a className="text-blue-500 " target="_blank" href="https://ethda.io/">
            ethda.io
          </a>
          <div className="text-xs mo:text-center mo:mt-2 text-contentSecondary-light dark:text-contentSecondary-dark">
            EthDA is a scalable Ethereum layer2 Data Availability solution.
          </div>
        </div>
        <div className="mo:gap-[50px]  mo:my-5 mo:w-full mo:justify-center flex gap-20">
          <Link
            href={"https://t.me/CrustNetwork"}
            target={"_blank"}
            className={"link-icon"}
          >
            <TelegramIcon />
          </Link>
          <Link
            href={"https://crustnetwork.medium.com/"}
            target={"_blank"}
            className={"link-icon"}
          >
            <MediumIcon />
          </Link>
          <Link
            href={"https://twitter.com/CrustNetwork"}
            target={"_blank"}
            className={"link-icon"}
          >
            <TwitterIcon />
          </Link>
          <Link
            href={"https://github.com/crustio"}
            target={"_blank"}
            className={"link-icon"}
          >
            <GithubIcon />
          </Link>
          <Link
            href={"https://discord.com/invite/Jbw2PAUSCR"}
            target={"_blank"}
            className={"link-icon"}
          >
            <DiscordIcon />
          </Link>
        </div>
      </div>
    </>
  );
};
