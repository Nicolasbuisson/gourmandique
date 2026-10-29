// The Gourmandique "G" — traced from `public/images/gourmandiqueLogo.jpg` with
// potrace, so this is the artwork itself rather than a redrawing of it. The faint
// watermark behind the letter in the JPEG is below the trace threshold and is not
// part of the outline.
//
// It is a FILLED outline, not a stroke, which is what preserves the copperplate
// thick/thin contrast — the hairlines really are hairlines. A stroked monoline
// cannot express that. The consequence worth knowing: `stroke-dashoffset` has
// nothing to animate here. To get the write-on reveal, animate a thick monoline
// centreline path inside a `<mask>` over this shape; the mask paints the letter
// in as the pen travels, and the letterform stays exactly this one.

export function GourmandiqueMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 901"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" d={MARK} />
    </svg>
  );
}

const MARK =
  "M403 14C340 22 275 62 243 112C216 154 208 222 224 266C248 330 325 383 407 391L431 394L431 427" +
  "C431 454 433 462 442 480C455 504 479 526 501 533C569 553 654 512 770 403C803 372 803 372 769 421" +
  "C755 440 717 497 684 548C579 709 558 738 510 784C476 816 454 831 416 849C367 872 330 880 268 880" +
  "C224 881 209 879 183 872C74 841 20 769 41 686C52 645 63 626 98 591C123 566 138 555 164 542" +
  "C183 533 213 522 232 517C260 510 274 509 308 510C365 513 391 523 421 553C447 580 456 601 452 636" +
  "C445 699 395 749 317 769C279 779 220 775 179 761C141 748 129 750 160 764C183 775 241 787 270 787" +
  "C347 786 430 736 453 676C466 642 466 602 452 572C434 533 392 501 338 487C308 480 250 480 217 488" +
  "C183 495 132 520 101 543C41 587 5 661 13 725C15 736 22 758 29 773C52 820 98 857 162 878" +
  "C192 888 198 889 268 889C336 889 346 888 382 878C489 849 588 782 655 693C686 651 700 627 730 560" +
  "C767 479 816 383 835 355C843 342 851 329 851 328C851 317 832 331 787 374C687 470 627 509 562 522" +
  "C531 528 510 523 498 506C487 491 481 453 485 426C490 397 495 389 510 389C531 389 613 370 663 353" +
  "C725 332 813 289 863 256C912 223 962 173 977 143C992 112 992 81 977 64C963 47 931 38 900 41" +
  "C846 47 772 71 711 101C694 109 679 116 677 116C674 116 665 108 656 99C598 39 490 2 403 14M376 29" +
  "C307 47 251 99 234 162C226 194 228 220 242 251C267 305 336 345 420 354C440 357 440 357 445 344" +
  "C464 290 535 212 618 156L668 122L642 99C613 73 570 49 528 35C491 24 410 21 376 29M879 54" +
  "C851 59 817 70 783 84C744 101 694 130 694 136C694 138 702 152 712 167C729 194 746 226 746 230" +
  "C746 231 744 232 741 232C738 232 733 227 731 221C723 204 685 144 681 144C680 144 665 155 649 168" +
  "C613 197 568 244 548 273C534 296 512 337 508 351C505 359 506 360 526 358C600 353 664 338 734 310" +
  "C892 247 1001 142 974 78C970 68 963 61 954 57C940 52 902 50 879 54";
