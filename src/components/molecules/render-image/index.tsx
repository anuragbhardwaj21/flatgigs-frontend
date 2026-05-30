import cn from "@/utils/cn";
import { Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type RenderImageProps = {
  url: string;
  className?: string;
};

const RenderImage = ({ url, className }: RenderImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [url]);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [url]);

  if (failed) {
    return (
      <Skeleton
        variant="rectangular"
        animation="wave"
        className={cn(className, "bg-black/5")}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          className="absolute inset-0 z-0 size-full!"
        />
      )}
      <img
        ref={imgRef}
        src={url}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "size-full object-cover transition-opacity duration-300 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
};

export default RenderImage;
