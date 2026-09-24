import { MotionValue, useTransform } from "framer-motion";

/**
 * Pads a scroll-progress mapping so it always spans 0 → 1, holding the first and
 * last output values at the ends.
 *
 * Framer's native scroll-timeline path pads a range that stops short of 1 with the
 * *first* output value, so e.g. [0, .15] → [1, 0] ramps back up to 1 at the end of the
 * section. Spelling out the end points avoids that.
 */
export function padRange<T extends number | string>(
  input: number[],
  output: T[]
): [number[], T[]] {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) {
    i.unshift(0);
    o.unshift(o[0]);
  }
  if (i[i.length - 1] < 1) {
    i.push(1);
    o.push(o[o.length - 1]);
  }
  return [i, o];
}

export function useScrollTransform<T extends number | string>(
  progress: MotionValue<number>,
  input: number[],
  output: T[]
) {
  const [i, o] = padRange(input, output);
  return useTransform(progress, i, o);
}
