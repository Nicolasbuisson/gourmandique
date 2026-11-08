type MediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

interface InstaItemProps {
  permaLink: string;
  mediaURL: string;
  mediaType: MediaType;
  caption: string;
  thumbnailURL?: string;
}

interface SvgProps {
  className: string;
}
