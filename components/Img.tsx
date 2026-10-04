import type { Img as ImgData } from "@/lib/content";
import { asset } from "@/lib/site";

type Props = {
  image: ImgData;
  className?: string;
  priority?: boolean;
};

/**
 * Plain <img> with intrinsic width/height (no layout shift) and the
 * base path applied. Lazy by default; pass `priority` for the hero only.
 */
export default function Img({ image, className = "", priority = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(image.src)}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={`block h-auto w-full ${className}`}
    />
  );
}
