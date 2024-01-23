import type { FC, ReactNode } from "react";

export const Header: FC<{ children: ReactNode }> = function ({ children }) {
  return (
    <div className="mo:pt-0 truncate pt-[10px] text-2xl font-bold">
      {children}
    </div>
  );
};
