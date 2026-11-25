"use client";
import gsap from "gsap";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import cake from "../../public/images/mimiWeddingCake.jpg";

export const FloatingGallery = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const plane1 = useRef<HTMLDivElement>(null);
  const plane2 = useRef<HTMLDivElement>(null);
  const plane3 = useRef<HTMLDivElement>(null);
  let requestAnimationFrameId: number | null = null;
  let xForce = 0;
  let yForce = 0;
  const easing = 0.08;
  const speed = 0.01;

  const manageMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { movementX, movementY } = e;
    xForce += movementX * speed;
    yForce += movementY * speed;

    if (requestAnimationFrameId == null) {
      requestAnimationFrameId = requestAnimationFrame(animate);
    }
  };

  const lerp = (start: number, target: number, amount: number) =>
    start * (1 - amount) + target * amount;

  const animate = () => {
    xForce = lerp(xForce, 0, easing);
    yForce = lerp(yForce, 0, easing);
    gsap.set(plane1.current, { x: `+=${xForce}`, y: `+=${yForce}` });
    gsap.set(plane2.current, {
      x: `+=${xForce * 0.5}`,
      y: `+=${yForce * 0.5}`,
    });
    gsap.set(plane3.current, {
      x: `+=${xForce * 0.25}`,
      y: `+=${yForce * 0.25}`,
    });

    if (Math.abs(xForce) < 0.01) xForce = 0;
    if (Math.abs(yForce) < 0.01) yForce = 0;

    if (xForce != 0 || yForce != 0) {
      requestAnimationFrameId = requestAnimationFrame(animate);
    } else {
      if (requestAnimationFrameId != null) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
      requestAnimationFrameId = null;
    }
  };

  return (
    <section
      onMouseMove={manageMouseMove}
      className="relative h-screen w-full overflow-hidden"
    >
      <div ref={plane1} className="absolute size-full brightness-70">
        <Image
          src={cake}
          alt="image"
          width={300}
          className="absolute left-[90%] top-[70%]"
        />
        <Image
          src={cake}
          alt="image"
          width={300}
          className="absolute left-[5%] top-[65%]"
        />
        <Image
          src={cake}
          alt="image"
          width={225}
          className="absolute left-[35%] top-0"
        />
      </div>
      <div ref={plane2} className="absolute size-full brightness-60">
        <Image
          src={cake}
          alt="image"
          width={250}
          className="absolute left-[5%] top-[10%]"
        />
        <Image
          src={cake}
          alt="image"
          width={200}
          className="absolute left-[80%] top-[5%]"
        />
        <Image
          src={cake}
          alt="image"
          width={225}
          className="absolute left-[60%] top-[60%]"
        />
      </div>
      <div ref={plane3} className="absolute size-full brightness-50">
        <Image
          src={cake}
          alt="image"
          width={150}
          className="absolute left-[65%] top-[2.5%]"
        />
        <Image
          src={cake}
          alt="image"
          width={200}
          className="absolute left-[40%] top-[75%]"
        />
      </div>
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-center text-lg">
        <h2 className="font-display text-h3 font-normal text-ink">{title}</h2>
        <p className="mt-2.5 text-ink-subtle">{subtitle}</p>
      </div>
    </section>
  );
};
