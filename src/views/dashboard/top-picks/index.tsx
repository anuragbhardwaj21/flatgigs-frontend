import CompareAddButton from "@/components/molecules/compare-add-button";
import WishlistButton from "@/components/molecules/wishlist-button";
import { useGetTopPicksQuery } from "@/store/services/listings-api";
import type { SearchListingItem } from "@/store/types/search";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import CustomTooltip from "@/components/atoms/custom-tooltip";
import { IconButton, Skeleton } from "@mui/material";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import RenderImage from "@/components/molecules/render-image";

const SKELETON_COUNT = 10;

const slideClassName =
  "relative aspect-4/5! w-60! overflow-hidden! rounded-2xl";

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
    refetchOnMountOrArgChange: true,
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
    <section className="w-full pb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StarsIcon className="text-lg text-main" />
          <h2 className="text-lg font-semibold text-black/80">Top picks</h2>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            aria-label="Previous top picks"
            onClick={handlePrev}
            disabled={isBeginning}
            className="shrink-0! bg-main/15! disabled:opacity-40!"
          >
            <ChevronLeftIcon className="text-lg text-main" />
          </IconButton>
          <IconButton
            type="button"
            aria-label="Next top picks"
            onClick={handleNext}
            disabled={isEnd}
            className="shrink-0! bg-main/15! disabled:opacity-40!"
          >
            <ChevronRightIcon className="text-lg text-main" />
          </IconButton>
        </div>
      </div>
      <Swiper
        modules={[Mousewheel, FreeMode]}
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
        spaceBetween={20}
        slidesPerView="auto"
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <SwiperSlide key={index} className={cn(slideClassName)}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  className="h-full! w-full!"
                />
              </SwiperSlide>
            ))
          : topPicks.map((pick) => (
              <SwiperSlide
                key={pick.id}
                className={cn(slideClassName, "cursor-pointer!")}
              >
                <motion.div
                  className="group relative size-full overflow-hidden"
                  initial="rest"
                  whileHover="hover"
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
                  <RenderImage url={pick.photo} className="size-full origin-center object-cover will-change-transform hover:scale-105 transition-transform duration-300 ease-out" />
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 z-10 flex flex-col items-start justify-between",
                      "bg-linear-to-b from-black/20 to-black/60 p-2 text-sm font-semibold text-white",
                      "opacity-80 transition-opacity duration-500 ease-out group-hover:opacity-100",
                    )}
                  >
                    <div className="flex w-full items-center justify-end gap-1 pointer-events-auto">
                      <CompareAddButton
                        listing={pickToListing(pick)}
                        className="bg-black/20!"
                      />
                      <WishlistButton
                        listingId={pick.id}
                        listingName={pick.name}
                        className="bg-black/20!"
                      />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1">
                      <CustomTooltip title={pick.name}>
                        <span className="pointer-events-auto line-clamp-1">
                          {pick.name}
                        </span>
                      </CustomTooltip>
                      <span className="text-xs text-white/80">
                        {pick.city.name}
                      </span>
                      <span className="text-xs text-white/80">
                        {pick?.rating?.toFixed(1)} • {pick?.reviewCount} Reviews
                      </span>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
};

export default TopPicks;
