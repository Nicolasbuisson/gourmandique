import { CarouselIcon } from "./icons/carouselIcon";
import { VideoIcon } from "./icons/videoIcon";

// every layer shares one grid cell and fades/dims on the same curve
const layerClass =
  "col-start-1 row-start-1 transition-[opacity,filter] duration-300 ease-out";

export const InstaItem = (props: InstaItemProps) => {
  const { permaLink, mediaURL, mediaType, caption, thumbnailURL = "" } = props;

  const iconClass = `${layerClass} m-1 block h-6 self-start justify-self-end fill-paper group-hover:brightness-40`;

  return (
    <a href={permaLink} target="_blank" rel="noopener noreferrer">
      <div className="group grid h-full w-(--carousel-item-width)">
        <img
          className={`${layerClass} aspect-4/5 h-full w-full object-cover group-hover:brightness-40`}
          src={mediaType === "VIDEO" ? thumbnailURL : mediaURL}
        />
        {/* filtered media becomes a stacking context and would paint over the caption */}
        {/* ~40 characters: 20ch over 2 clamped lines, ellipsised past that */}
        <p
          className={`${layerClass} relative z-1 line-clamp-2 max-w-[min(20ch,80%)] content-center self-center justify-self-center text-center text-sm text-pretty text-paper opacity-0 group-hover:opacity-100`}
        >
          {caption}
        </p>
        {mediaType === "CAROUSEL_ALBUM" ? (
          <CarouselIcon className={iconClass}></CarouselIcon>
        ) : mediaType === "VIDEO" ? (
          <VideoIcon className={iconClass}></VideoIcon>
        ) : (
          <></>
        )}
      </div>
    </a>
  );
};
