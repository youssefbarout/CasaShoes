import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, isVisible].
 * @param {number} threshold  - 0..1, how much of the element must be visible
 * @param {string} rootMargin - e.g. "0px 0px -80px 0px"  shifts trigger zone
 * @param {boolean} once      - if true, stops observing after first trigger
 */
export function useInView(threshold = 0.15, rootMargin = "0px 0px -60px 0px", once = true) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, visible];
}
