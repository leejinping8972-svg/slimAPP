import type { StaticImageData } from "next/image";

export const getImageSrc = (image: string | StaticImageData): string => {
  return typeof image === "string" ? image : image.src;
};
