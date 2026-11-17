import { useState } from "react";
import type { Picture as PictureSource } from "../../data/media";

export function Picture({
  image,
  className,
  priority = false,
}: {
  image: PictureSource;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        role="img"
        aria-label={image.alt}
        className={`block bg-raised ${className ?? ""}`}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      />
    );
  }
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
