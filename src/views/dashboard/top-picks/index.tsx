import CompareAddButton from "@/components/molecules/compare-add-button";
import WishlistButton from "@/components/molecules/wishlist-button";
import { useGetTopPicksQuery } from "@/store/services/listings-api";
import type { SearchListingItem } from "@/store/types/search";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import CustomTooltip from "@/components/atoms/custom-tooltip";
import { IconButton, Skeleton } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FreeMode, Mousewheel,Autoplay} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import RenderImage from "@/components/molecules/render-image";

const SKELETON_COUNT = 10;

const slideClassName =
  "relative aspect-4/5! w-56! overflow-hidden! rounded-[1.35rem] sm:w-60!";

const pickToListing = (pick: {
  id: string;
  name: string;
  photo: string;
  propertyType: string;
  roomType: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
}): SearchListingItem => ({
  id: pick.id,
  name: pick.name,
  photos: [pick.photo],
  propertyType: pick.propertyType,
  roomType: pick.roomType,
  pricePerNight: pick.pricePerNight,
  totalForStay: pick.pricePerNight,
  rating: pick.rating,
  reviewCount: pick.reviewCount,
  amenities: [],
  latitude: 0,
  longitude: 0,
});

const TopPicks = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetTopPicksQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const StarsIcon = useIcon("stars");
  const ChevronLeftIcon = useIcon("chevronLeft");
  const ChevronRightIcon = useIcon("chevronRight");
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const topPicks = data?.picks ?? [];

  const syncNavState = useCallback((swiper: SwiperInstance) => {
    setIsBeginning(swiper.isBeginning || swiper.progress <= 0);
    setIsEnd(swiper.isEnd || swiper.progress >= 1);
  }, []);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  if (!isLoading && (isError || topPicks.length === 0)) return null;

  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-main/75">
            <StarsIcon className="size-3" aria-hidden />
            Curated for you
          </div>
          <h2 className="text-xl font-bold tracking-tight text-black/85 sm:text-2xl">
            Top picks
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <IconButton
            type="button"
            aria-label="Previous top picks"
            onClick={handlePrev}
            disabled={isBeginning}
            size="small"
            className="size-8! border! border-black/6! bg-background-paper/80! disabled:opacity-35!"
          >
            <ChevronLeftIcon className="text-base text-black/70" />
          </IconButton>
          <IconButton
            type="button"
            aria-label="Next top picks"
            onClick={handleNext}
            disabled={isEnd}
            size="small"
            className="size-8! border! border-black/6! bg-background-paper/80! disabled:opacity-35!"
          >
            <ChevronRightIcon className="text-base text-black/70" />
          </IconButton>
        </div>
      </div>

      <Swiper
        modules={[Mousewheel, FreeMode, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncNavState(swiper);
        }}
        onSlideChange={syncNavState}
        onProgress={syncNavState}
        onResize={syncNavState}
        onTransitionEnd={syncNavState}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
        }}
        freeMode={{ enabled: true }}
        speed={450}
        spaceBetween={16}
        slidesPerView="auto"
        className="overflow-visible!"
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <SwiperSlide key={index} className={cn(slideClassName)}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  className="h-full! w-full! rounded-xl!"
                />
              </SwiperSlide>
            ))
          : topPicks.map((pick, index) => (
              <SwiperSlide
                key={pick.id}
                className={cn(slideClassName, "cursor-pointer!")}
              >
                <div
                  className="group relative size-full overflow-hidden rounded-xl ring-1 ring-black/6"
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/results/${pick.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/results/${pick.id}`);
                    }
                  }}
                >
                  <RenderImage
                    url={pick.photo}
                    className="size-full! origin-center object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 z-10 flex flex-col items-start justify-between p-3 text-white",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-1 pointer-events-auto">
                      {pick.badge ? (
                        <span className="rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm">
                          {pick.badge}
                        </span>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1">
                        <CompareAddButton
                          listing={pickToListing(pick)}
                          className="bg-black/25!"
                        />
                        <WishlistButton
                          listingId={pick.id}
                          listingName={pick.name}
                          className="bg-black/25!"
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-start gap-0.5">
                      <CustomTooltip title={pick.name}>
                        <span className="pointer-events-auto line-clamp-1 text-sm font-semibold">
                          {pick.name}
                        </span>
                      </CustomTooltip>
                      <span className="text-[11px] text-white/75">
                        {pick.city.name}
                      </span>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-white/80">
                        <span className="font-semibold tabular-nums">
                          €{pick.pricePerNight}
                          <span className="font-normal text-white/60">
                            /night
                          </span>
                        </span>
                        <span className="text-white/35">·</span>
                        <span className="tabular-nums">
                          {pick.rating.toFixed(1)} ({pick.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
};

export default TopPicks;
