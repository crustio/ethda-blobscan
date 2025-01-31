import { Montserrat } from "next/font/google";
import Link from "next/link";
import classNames from "classnames";

import { Logo } from "../../BlobscanLogo";
import { ExplorerDetails } from "../../ExplorerDetails";
import { NavMenusSection } from "../../NavMenusSection";
import { SearchInput } from "../../SearchInput";
import { ThemeModeButton } from "../../ThemeModeButton";
import { TopBarSurface } from "./TopBarSurface";

const montserrat = Montserrat({ subsets: ["latin"] });

export const DesktopNav: React.FC = () => {
  return (
    <div>
      <TopBarSurface>
        <div className="flex h-full items-center justify-between">
          <Link href="/">
            <div className="flex grow items-center gap-3">
              <Logo className="mo:w-20 w-[120px] " />
              <span
                className={classNames(
                  "mo:text-xl text-[30px]",
                  montserrat.className
                )}
              >
                Blobscan
              </span>
            </div>
          </Link>
          <div className="flex grow-[3] items-center justify-end gap-5">
            <div className="self-end">
              <NavMenusSection />
            </div>
            <div className="w-full sm:max-w-xl">
              <SearchInput />
            </div>
            <ThemeModeButton />
          </div>
        </div>
      </TopBarSurface>
      <TopBarSurface>
        <div className="-my-1 flex items-center gap-2">
          <ExplorerDetails />
        </div>
      </TopBarSurface>
    </div>
  );
};
