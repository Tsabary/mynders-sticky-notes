import { useEffect, useRef, useState } from "react";
import RightColumnHeader from "./RightColumnHeader";

function RightColumn({ children }: { children: React.ReactNode }) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  // Function to measure and set the width of the component
  const updateWidth = () => {
    const currentWidth = componentRef.current
      ? componentRef.current.offsetWidth
      : 0;
    setWidth(currentWidth);
  };

  // Effect to measure the width on mount and on window resize
  useEffect(() => {
    updateWidth(); // Call immediately to set initial width
    // Function to handle resize event
    const handleResize = () => {
      updateWidth();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div
        ref={componentRef}
        className="relative flex-1 bg-white rounded-none md:rounded-3xl md:rounded-r-md xl:rounded-r-3xl overflow-hidden"
      >
        <div
          className={["flex flex-col absolute top-0 left-0 bottom-0"].join(" ")}
          style={{ width: width }}
        >
          {/* right column header */}
          <RightColumnHeader />
          <div className="relative flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default RightColumn;
