import type { ReactNode } from "react";

const Filter = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-semibold text-black/80">{title}</span>
    {children}
  </div>
);

export default Filter;
