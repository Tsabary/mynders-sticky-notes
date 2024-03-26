import { useEffect, useState } from "react";

function LeftColumn({
  isForceOpen,
  viewportHeight,
}: {
  isForceOpen?: boolean;
  viewportHeight: number;
}) {
  const [hover, setHover] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);

  const isExpended = hoverEffect || isForceOpen;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hover) {
      timer = setTimeout(() => {
        setHoverEffect(true);
      }, 300); // Delay in milliseconds
    } else {
      setHoverEffect(false);
    }

    return () => clearTimeout(timer); // Cleanup on unmount or hover state change
  }, [hover]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={[
        "relative transition-all ease-in-out flex flex-col items-stretch overflow-auto z-10 gap-1",
        isExpended
          ? "w-[340px] p-4 pt-6"
          : "w-0 md:w-12 lg:w-16 pb-4 pt-6 md:px-2 lg:p-4 lg:pt-6",
      ].join(" ")}
      style={{ height: viewportHeight }}
    />
  );
}

export default LeftColumn;
