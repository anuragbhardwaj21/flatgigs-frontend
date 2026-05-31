import RenderImage from "@/components/molecules/render-image";
import cn from "@/utils/cn";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23e8ebe9' width='800' height='600'/%3E%3C/svg%3E";

type HeroGalleryProps = {
  photos: string[];
};

const PhotoFrame = ({
  url,
  className,
  priority,
}: {
  url: string;
  className?: string;
  priority?: boolean;
}) => (
  <div
    className={cn(
      "group relative size-full overflow-hidden bg-black/5",
      className,
    )}
  >
    <RenderImage
      url={url}
      className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-black/5 opacity-80"
    />
    {priority && (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20"
      />
    )}
  </div>
);

const HeroGallery = ({ photos }: HeroGalleryProps) => {
  const images = photos.length > 0 ? photos : [PLACEHOLDER];
  const [hero, ...rest] = images;

  if (images.length === 1) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_12px_48px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
        <div className="aspect-16/7">
          <PhotoFrame url={hero} priority />
        </div>
        {photos.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            1 / {photos.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_12px_48px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
      <div className="grid h-[min(54vh,440px)] grid-cols-1 gap-px bg-black/10 sm:grid-cols-[1.15fr_0.85fr]">
        <PhotoFrame url={hero} priority />
        <div className="hidden grid-rows-2 gap-px bg-black/10 sm:grid">
          {rest.slice(0, 2).map((photo, index) => (
            <PhotoFrame key={index} url={photo} />
          ))}
        </div>
      </div>
      {photos.length > 1 && (
        <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {photos.length} photos
        </span>
      )}
    </div>
  );
};

export default HeroGallery;
