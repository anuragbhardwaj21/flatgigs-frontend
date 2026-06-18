import { useEffect } from "react";
import brandSvg from "@/assets/brand.svg?raw";
import { brandPrimaryMap, type BrandSchemeKey } from "./color-schemes";

const FAVICON_SELECTOR = 'link[rel="icon"]';

const toSvgDataUrl = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

const getFaviconLink = () => {
  const existing = document.querySelector<HTMLLinkElement>(FAVICON_SELECTOR);
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  document.head.appendChild(link);
  return link;
};

export const useThemeFavicon = (scheme: BrandSchemeKey) => {
  useEffect(() => {
    const [primaryColor] = brandPrimaryMap[scheme];
    const faviconSvg = brandSvg.replaceAll("currentColor", primaryColor);
    const link = getFaviconLink();

    link.type = "image/svg+xml";
    link.href = toSvgDataUrl(faviconSvg);
  }, [scheme]);
};
