import { BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";
import cn from "@/utils/cn";

const BrandIcon = ({
  fullMode = false,
  link = false,
}: {
  fullMode?: boolean;
  link?: boolean;
}) => {
  const content = (
    <>
      <p className="active:opacity-70 aspect-square w-fit rounded-xl border-2 border-white/50 bg-main p-2 opacity-80 transition-opacity duration-300 hover:opacity-100">
        <BsStars className="text-xl" />
      </p>
      {fullMode && <span className="text-md font-semibold">FlatGigs</span>}
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
