import { useEffect, useState } from "react";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

function MyndersContainer({ children }: { children: React.ReactNode }) {

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full max-h-screen">
      <div className="relative flex items-stretch bg-[#202022] h-full max-h-screen w-full md:p-0.5 border overflow-hidden z-50">
        <LeftColumn viewportHeight={viewportHeight} />
        <RightColumn>{children}</RightColumn>
      </div>
    </div>
  );
}

export default MyndersContainer;
