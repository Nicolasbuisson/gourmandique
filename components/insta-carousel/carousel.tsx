"use client";
import { CSSProperties, ReactNode, useState } from "react";

interface IProps {
  pageSize: number;
  totalPages: number;
  children: ReactNode;
  itemWidthMin?: number;
  itemWidthMax?: number;
  dynamicSize?: boolean;
  rootClass?: string;
}

export const Carousel = (props: IProps) => {
  const {
    pageSize,
    totalPages,
    children,
    itemWidthMin = 100,
    itemWidthMax = 312,
    dynamicSize = false,
    rootClass,
  } = props;

  const [index, setIndex] = useState<number>(0);

  const updateIndex = (index: number) => {
    const modulatedIndex =
      index < 0
        ? totalPages - 1 // if index is less than 0, go to the end
        : index >= totalPages
          ? 0 // if index is greater than total pages, go to start
          : Math.min(index, totalPages - 1); // else increment page accordingly
    setIndex(modulatedIndex);
  };

  // children read --carousel-item-width to size themselves
  const containerStyle = {
    "--carousel-item-width": `clamp(${itemWidthMin}px, 14vw + 2rem, ${itemWidthMax}px)`,
    "--carousel-items-per-page": pageSize,
  } as CSSProperties;

  const buttonClass =
    "absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer bg-accent/85 text-on-accent transition-colors duration-200 ease-silk hover:bg-accent-hover";
  const arrowClass = "h-6 fill-current max-[440px]:h-5";

  return (
    <div
      className={`relative overflow-hidden ${
        dynamicSize
          ? "w-full"
          : "w-[calc(var(--carousel-items-per-page)*var(--carousel-item-width))]"
      }`}
      style={containerStyle}
      id="carousel-container"
    >
      <button
        className={`${buttonClass} left-0 rounded-r-pill pt-2 pr-2 pb-1.5 max-[440px]:pt-3 max-[440px]:pr-3 max-[440px]:pb-2.5`}
        aria-label="Previous"
        onClick={() => {
          updateIndex(index - 1);
        }}
      >
        <svg
          className={arrowClass}
          viewBox="0 0 32 32"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.505 0c0.271 0 0.549 0.107 0.757 0.316 0.417 0.417 0.417 1.098 0 1.515l-14.258 14.264 14.050 14.050c0.417 0.417 0.417 1.098 0 1.515s-1.098 0.417-1.515 0l-14.807-14.807c-0.417-0.417-0.417-1.098 0-1.515l15.015-15.022c0.208-0.208 0.486-0.316 0.757-0.316z"></path>
        </svg>
      </button>
      <button
        className={`${buttonClass} right-0 rounded-l-pill pt-2 pb-1.5 pl-2 max-[440px]:pt-3 max-[440px]:pb-2.5 max-[440px]:pl-3`}
        aria-label="Next"
        onClick={() => {
          updateIndex(index + 1);
        }}
      >
        <svg
          className={arrowClass}
          viewBox="0 0 32 32"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"></path>
        </svg>
      </button>
      <div
        className={`flex flex-row transition-transform duration-400 ease-silk ${
          dynamicSize ? "*:w-[calc(100%/var(--carousel-items-per-page))]" : ""
        } ${rootClass ? rootClass : ""}`}
        style={{ transform: `translateX(${index * -100}%)` }}
      >
        {children}
      </div>
    </div>
  );
};
