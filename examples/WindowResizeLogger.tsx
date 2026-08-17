import { useEffect, useState } from "react";
import { useDebounce } from "../src/useDebounce";

export function WindowResizeLogger() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const debouncedResize = useDebounce(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, 250);

  useEffect(() => {
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
    };
  }, [debouncedResize]);

  return (
    <p>
      Window size: {size.width}px x {size.height}px
    </p>
  );
}
