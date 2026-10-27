// The "Gourmandique" wordmark, drawn in the copperplate hand of the engraved G
// in `public/images/gourmandiqueLogo.jpg` — the same tall slanted bowl, the same
// straight spike across its open top right, the same loop falling out of the
// letter. Sheared 15° off vertical, which is what gives every oval its tilt.
//
// The whole word is ONE unbroken path. That is a constraint, not an accident of
// authoring: the reveal animation works by shrinking `stroke-dashoffset`, so the
// pen appears to write the word in a single gesture, and a second subpath would
// start writing itself at the same instant. `pathLength={1}` normalises the
// measurement — the animation is always `stroke-dasharray: 1` with the offset
// running 1 → 0, with no getTotalLength() call and no magic number to re-measure
// when a curve is tweaked.
//
// The tittle (the dot of the "i") is the one place the pen genuinely lifts, so it
// is its own path, to drop in after the letters finish.

export function GourmandiqueWordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="120 91 1539 286"
      fill="none"
      stroke="currentColor"
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path data-wordmark="letters" pathLength={1} d={LETTERS} />
      <path data-wordmark="tittle" pathLength={1} d={TITTLE} />
    </svg>
  );
}

// Baseline y=300, x-height top y=222, ascender y=104, descender y=370.
const LETTERS = [
  // G — the logo's own gesture: a tall slanted bowl, the straight
  // spike crossing its open top right, and the beard that falls away into the
  // lower loop and sweeps out to meet the o
  "M 236 188",
  "C 262 166 294 138 316 114",
  "C 295 104 249 102 214 116",
  "C 173 132 148 168 138 212",
  "C 128 256 148 292 192 294",
  "C 229 296 266 272 279 238",
  "C 288 218 312 212 325 222",
  "C 336 232 332 262 314 300",
  "C 296 336 267 356 245 348",
  "C 229 342 234 322 255 312",
  "C 277 302 309 298 335 296",
  // o — bowl counter-clockwise from the top, closed with the small eyelet
  // copperplate uses to leave the letter at x-height
  "C 398 284 425 252 435 222",
  "C 426 210 403 214 390 240",
  "C 377 266 378 292 397 298",
  "C 415 304 440 286 449 258",
  "C 457 236 455 222 442 218",
  "C 431 214 425 222 433 230",
  "C 443 238 457 236 466 242",
  // u — pointed tops, rounded turns on the baseline
  "C 472 262 467 282 472 292",
  "C 479 304 496 300 507 280",
  "C 519 258 529 236 535 222",
  "C 527 246 517 274 519 288",
  "C 523 304 541 302 554 284",
  // r — stands a little taller than its neighbours, then a flat shoulder
  "C 580 254 596 220 606 190",
  "C 616 180 635 184 640 198",
  "C 643 208 637 236 633 260",
  "C 629 280 626 292 628 300",
  "C 633 312 650 308 662 292",
  // m — three arches
  "C 690 272 701 246 709 224",
  "C 716 212 730 210 733 224",
  "C 733 244 727 268 723 288",
  "C 724 296 731 296 738 286",
  "C 749 258 760 232 767 222",
  "C 776 210 790 212 789 228",
  "C 788 248 781 274 779 288",
  "C 780 296 787 296 794 286",
  "C 805 258 816 232 823 222",
  "C 832 210 846 212 845 228",
  "C 844 250 838 278 838 292",
  "C 842 306 861 304 874 286",
  // a — oval, then the stem down its right side
  "C 898 264 917 236 927 222",
  "C 920 210 899 216 886 240",
  "C 874 264 874 292 893 298",
  "C 909 303 926 286 937 258",
  "C 946 238 948 226 948 220",
  "C 939 246 930 276 930 292",
  "C 934 306 953 304 966 286",
  // n — two arches
  "C 988 264 1001 238 1009 222",
  "C 1018 210 1032 212 1031 228",
  "C 1030 248 1023 274 1021 288",
  "C 1022 296 1029 296 1036 286",
  "C 1047 258 1058 232 1065 222",
  "C 1074 210 1088 212 1087 228",
  "C 1085 252 1080 278 1080 292",
  "C 1084 306 1103 304 1116 286",
  // d — oval, then the slim looped ascender, crossing itself low
  "C 1138 264 1157 236 1167 222",
  "C 1160 210 1139 216 1126 240",
  "C 1114 264 1114 292 1133 298",
  "C 1149 303 1168 286 1179 258",
  "C 1188 238 1190 226 1190 220",
  "C 1205 186 1228 146 1246 124",
  "C 1260 108 1243 104 1228 124",
  "C 1215 142 1204 196 1195 244",
  "C 1191 268 1188 286 1190 294",
  "C 1194 308 1212 306 1225 288",
  // i — bare stem; the tittle is the second path
  "C 1249 266 1265 238 1273 222",
  "C 1271 244 1267 274 1267 290",
  "C 1270 306 1289 304 1302 286",
  // q — oval, then the descender turning right and climbing back to the baseline
  "C 1326 264 1345 236 1355 222",
  "C 1348 210 1327 216 1314 240",
  "C 1302 264 1302 292 1321 298",
  "C 1337 303 1356 286 1367 258",
  "C 1376 238 1378 226 1378 220",
  "C 1367 252 1351 302 1345 334",
  "C 1340 360 1359 370 1383 354",
  "C 1400 344 1418 314 1435 268",
  "C 1443 248 1448 232 1451 222",
  // u (again)
  "C 1443 246 1433 274 1435 288",
  "C 1439 302 1456 300 1467 280",
  "C 1479 258 1489 236 1495 222",
  "C 1487 246 1477 274 1479 288",
  "C 1483 302 1499 302 1512 286",
  // e — the loop crosses its own entry stroke
  "C 1535 268 1548 248 1560 234",
  "C 1571 222 1564 212 1552 220",
  "C 1537 230 1525 252 1524 272",
  "C 1522 292 1539 302 1562 294",
  "C 1577 288 1590 276 1600 262",
  "C 1616 242 1633 236 1645 246",
].join(" ");

const TITTLE = "M 1292 174 C 1292 177 1292 180 1293 183";
