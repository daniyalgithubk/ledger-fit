import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export default function AnimatedNumber({ value, decimals = 0, duration = 0.9 }) {
  const reduce = useReducedMotion();
  const target = Number(value) || 0;
  const [n, setN] = useState(reduce ? target : 0);
  const from = useRef(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setN(target);
      return;
    }
    const controls = animate(from.current, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        from.current = v;
        setN(v);
      },
    });
    return () => controls.stop();
  }, [target, duration, reduce]);

  return (
    <>
      {n.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </>
  );
}