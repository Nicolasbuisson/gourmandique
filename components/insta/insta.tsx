"use client";
import { Carousel } from "components/insta-carousel/carousel";
import { useWindowSize } from "hooks/useWindowSize";
import { useCallback } from "react";
import { InstaItem } from "./instaItem";

interface InstaProps {
  instaItems: InstaItemProps[];
  totalItems: number;
}

export const Insta = (props: InstaProps) => {
  const { instaItems, totalItems } = props;

  const { width: windowWidth } = useWindowSize();

  const getPageSize = useCallback((): number => {
    if (windowWidth <= 440) {
      return 2;
    } else if (440 < windowWidth && windowWidth <= 620) {
      return 3;
    } else if (620 < windowWidth && windowWidth <= 880) {
      return 4;
    } else {
      return 5;
    }
  }, [windowWidth]);

  return (
    <Carousel
      pageSize={getPageSize()}
      totalPages={Math.floor(totalItems / getPageSize())}
      itemWidthMin={124}
    >
      {instaItems.map((item) => {
        return (
          <InstaItem
            // media urls expire and are absent for albums, permalinks are stable
            key={item.permaLink}
            permaLink={item.permaLink}
            mediaURL={item.mediaURL}
            mediaType={item.mediaType}
            caption={item.caption}
            thumbnailURL={item.thumbnailURL}
          ></InstaItem>
        );
      })}
    </Carousel>
  );
};
