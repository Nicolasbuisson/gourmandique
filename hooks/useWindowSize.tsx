"use client";
import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleResize = () => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight }); // set initial value on mount
    window.addEventListener("resize", handleResize);
    window.addEventListener("reset", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("reset", handleResize);
    };
  }, []);

  return dimensions;
};
