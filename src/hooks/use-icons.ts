import { useMemo } from "react";
import type { IconType } from "react-icons";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { GrDocumentMissing } from "react-icons/gr";
import { IoCloseOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { BiSolidCommentDetail } from "react-icons/bi";  
import { IoIosSend } from "react-icons/io";
import { CiGrid41 } from "react-icons/ci";
import { CiMap } from "react-icons/ci";
import { LuArrowUpDown } from "react-icons/lu";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { VscHeart } from "react-icons/vsc";
import { VscHeartFilled } from "react-icons/vsc";
import { FaStar } from "react-icons/fa6";

export const ICON_REGISTRY = {
  search: CiSearch,
  calendar: FaCalendarAlt,
  gear: FaGear,
  close: IoCloseOutline,
  stars: BsStars,
  location: FaLocationDot,
  users: FiUsers,
  chat: BiSolidCommentDetail,
  send: IoIosSend,
  grid: CiGrid41,
  map: CiMap,
  arrowUpDown: LuArrowUpDown,
  chevronLeft: GoChevronLeft,
  chevronRight: GoChevronRight,
  heart: VscHeart,
  heartFilled: VscHeartFilled,
  star: FaStar,
} as const satisfies Record<string, IconType>;

export type IconName = keyof typeof ICON_REGISTRY;

const FALLBACK_ICON: IconType = GrDocumentMissing;

function resolveIcon(name?: string): IconType {
  const key = name?.trim().toLowerCase();
  if (!key) return FALLBACK_ICON;

  const match = (
    Object.entries(ICON_REGISTRY) as [IconName, IconType][]
  ).find(([registryKey]) => registryKey.toLowerCase() === key);

  if (match) return match[1];

  if (import.meta.env.DEV) {
    console.warn(
      `[useIcon] Unknown icon "${name}". Using GrDocumentMissing. Add it to ICON_REGISTRY in use-icons.ts.`,
    );
  }

  return FALLBACK_ICON;
}

/**
 * Resolves a registered icon name to a react-icons component.
 *
 * @example
 * const IconSearch = useIcon("search");
 * return <IconSearch className="text-xl" />;
 */
export function useIcon(name?: string): IconType {
  return useMemo(() => resolveIcon(name), [name]);
}

export { GrDocumentMissing as IconMissing };
