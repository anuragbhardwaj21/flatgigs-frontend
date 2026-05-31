import { Skeleton } from "@mui/material";

const ListingDetailSkeleton = () => (
  <div
    className="main-container space-y-6 py-6"
    aria-busy="true"
    aria-label="Loading listing"
  >
    <div className="flex items-center justify-between gap-3">
      <Skeleton animation="wave" height={32} width={88} className="rounded-full!" />
      <div className="flex gap-2">
        <Skeleton animation="wave" variant="circular" width={36} height={36} />
        <Skeleton animation="wave" variant="circular" width={36} height={36} />
      </div>
    </div>
    <Skeleton
      animation="wave"
      variant="rectangular"
      className="aspect-16/7! w-full! rounded-[1.75rem]!"
    />
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Skeleton animation="wave" width={96} height={28} className="rounded-full!" />
          <Skeleton animation="wave" width={88} height={28} className="rounded-full!" />
          <Skeleton animation="wave" width={72} height={28} className="rounded-full!" />
        </div>
        <Skeleton animation="wave" height={40} width="72%" />
        <Skeleton animation="wave" height={18} width="42%" />
        <Skeleton animation="wave" height={88} className="w-full! rounded-2xl!" />
        <Skeleton animation="wave" height={140} className="w-full! rounded-2xl!" />
        <Skeleton animation="wave" height={220} className="w-full! rounded-2xl!" />
      </div>
      <Skeleton
        animation="wave"
        variant="rectangular"
        height={400}
        className="w-full! rounded-[1.75rem]!"
      />
    </div>
  </div>
);

export default ListingDetailSkeleton;
