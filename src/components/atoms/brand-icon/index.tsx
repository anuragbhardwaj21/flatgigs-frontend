import { Link } from "react-router-dom";
import cn from "@/utils/cn";
import IconBrand from "@/assets/brand.svg?react";

const BrandIcon = ({
  fullMode = false,
  link = false,
}: {
  fullMode?: boolean;
  link?: boolean;
}) => {
  const content = (
    <>
      <p className="active:opacity-70 aspect-square w-fit rounded-xl border-2 border-white/50 bg-main p-1 opacity-80 transition-opacity duration-300 hover:opacity-100">
        <IconBrand className="size-7!" />
      </p>
      {fullMode && <span className="text-md font-semibold">Zavo</span>}
    </>
  );

  const className = cn(
    "flex items-center gap-2 select-none",
    link && "cursor-pointer",
  );

  if (link) {
    return (
      <Link to="/" className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

export default BrandIcon;
