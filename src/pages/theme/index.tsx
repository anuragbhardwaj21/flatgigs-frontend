import { brandPrimaryMap } from "@/utils/mui/color-schemes";
import { useThemeScheme } from "@/utils/mui/theme-scheme-context";
import cn from "@/utils/cn";
import { Skeleton } from "@mui/material";
import { motion } from "motion/react";
import type { CSSProperties } from "react";

const formatSchemeName = (scheme: string) =>
  scheme.charAt(0).toUpperCase() + scheme.slice(1);

type PreviewStyle = CSSProperties & {
  "--preview-main": string;
};

const skeletonSx = {
  bgcolor: "color-mix(in srgb, var(--preview-main) 10%, transparent)",
} as const;

const ThemePreviewCard = ({
  option,
  selected,
  onSelect,
}: {
  option: keyof typeof brandPrimaryMap;
  selected: boolean;
  onSelect: () => void;
}) => {
  const [previewMain] = brandPrimaryMap[option];

  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      style={{ "--preview-main": previewMain } as PreviewStyle}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/82 text-left outline-none backdrop-blur transition-[border-color,box-shadow,transform] duration-150 ease-in-out",
        selected
          ? "border-(--preview-main) shadow-[0_18px_46px_-24px_var(--preview-main)] border-2"
          : "border-black/7 hover:border-(--preview-main) hover:shadow-[0_18px_46px_-30px_var(--preview-main)]",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 -top-16 h-24 rounded-full bg-[color-mix(in_srgb,var(--preview-main)_20%,transparent)] blur-3xl transition-opacity duration-150 group-hover:opacity-90"
      />
      <div className="relative border-b border-black/5 px-3.5 py-3">
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-(--preview-main)">
              {selected ? "Selected" : "Homepage"}
            </p>
            <h2 className="mt-0.5 text-sm font-bold tracking-tight text-black/85">
              {formatSchemeName(option)}
            </h2>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--preview-main)_20%,transparent)] bg-white/75 px-1.5 py-1 shadow-sm">
            <span className="size-3 rounded-full bg-(--preview-main)" />
            <span className="size-3 rounded-full bg-[color-mix(in_srgb,var(--preview-main)_35%,white)]" />
          </span>
        </div>
      </div>

      <div className="relative bg-linear-to-b from-[color-mix(in_srgb,var(--preview-main)_8%,transparent)] to-white p-3.5">
        <div className="mx-auto max-w-[280px] text-center">
          <span className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--preview-main)_18%,transparent)] bg-white/75 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.16em] text-(--preview-main)">
            AI stays
          </span>
          <div className="mt-2.5 space-y-1">
            <Skeleton
              variant="rounded"
              width="78%"
              height={9}
              className="mx-auto!"
              sx={skeletonSx}
            />
            <Skeleton
              variant="rounded"
              width="52%"
              height={9}
              className="mx-auto!"
              sx={skeletonSx}
            />
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-black/6 bg-white/90 p-2.5 shadow-[0_14px_36px_-28px_rgba(0,0,0,0.55)]">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="size-4 rounded-lg bg-(--preview-main)" />
            <Skeleton variant="rounded" width="32%" height={7} sx={skeletonSx} />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-black/5 bg-black/1.5 p-1"
              >
                <Skeleton variant="rounded" width="55%" height={5} />
                <Skeleton
                  variant="rounded"
                  width="80%"
                  height={6}
                  className="mt-1!"
                  sx={skeletonSx}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-[color-mix(in_srgb,var(--preview-main)_8%,transparent)] p-1.5">
            <span className="flex size-5 items-center justify-center rounded-lg bg-(--preview-main) text-[9px] font-bold text-white">
              Z
            </span>
            <Skeleton variant="rounded" width="100%" height={6} sx={skeletonSx} />
            <span className="size-5 rounded-lg bg-(--preview-main)" />
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <Skeleton variant="rounded" width="24%" height={7} sx={skeletonSx} />
            <div className="flex gap-0.5">
              <span className="size-4 rounded-full border border-black/6 bg-white" />
              <span className="size-4 rounded-full bg-(--preview-main)" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-4/5 overflow-hidden rounded-lg bg-black/6 first:col-span-2"
              >
                <div className="h-full bg-linear-to-b from-[color-mix(in_srgb,var(--preview-main)_22%,transparent)] via-black/8 to-black/55 p-1.5">
                  <div className="ml-auto size-3 rounded-full bg-white/75" />
                  <div className="mt-auto flex h-full flex-col justify-end gap-1">
                    <Skeleton variant="rounded" width="80%" height={5} />
                    <Skeleton variant="rounded" width="50%" height={5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

const ThemePage = () => {
  const { scheme, schemes, setScheme } = useThemeScheme();

  return (
    <main className="main-container py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-main/80">
          Appearance
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black/90">
          Choose theme
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/50">
          Pick a color scheme for Zavo. Your choice is saved on this device.
        </p>
        </div>
        <div className="rounded-full border border-main/15 bg-background-paper px-3 py-1 text-xs font-semibold text-main">
          {schemes.length} themes
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {schemes.map((option) => (
          <ThemePreviewCard
            key={option}
            option={option}
            selected={option === scheme}
            onSelect={() => setScheme(option)}
          />
        ))}
      </section>
    </main>
  );
};

export default ThemePage;
