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
      <div className="mx-auto flex flex-col items-center justify-center space-y-4 p-2">
        <div className="md:hidden">
          <ExplorerDetails />
        </div>
        <div className="mo:mx-[5px] flex flex-col justify-center  ">
          <span className="text-center text-xs text-contentSecondary-light dark:text-contentSecondary-dark">
            EthDA Blobscan is a fork of Blobscan
          </span>
          <div className="mo:flex mo:flex-row mo:justify-center flex-col flex-wrap ">
            <div className="text-center text-xs text-contentSecondary-light dark:text-contentSecondary-dark">
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
            <div className="text-center text-xs text-contentSecondary-light dark:text-contentSecondary-dark">
              transactions, providing the necessary infrastructure to scale
              Ethereum.
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10 mb-10 mt-10 flex flex-wrap items-center justify-between ">
        <div className="mo:flex mo:justify-center mo:text-center mo:w-full mo:flex-col text-xs">
          <a className="text-blue-500 " href="https://ethda.io/">
            ethda.io
          </a>
          <div className="mo:text-center mo:mt-2 text-xs text-contentSecondary-light dark:text-contentSecondary-dark">
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
