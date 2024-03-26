import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";

function MyndersContainer({ children }: { children: React.ReactNode }) {
  const [isLeftColumnDrawerOpen, setIsLeftColumnDrawerOpen] = useState(false);

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Drawer
        open={isLeftColumnDrawerOpen}
        onClose={() => {
          setIsLeftColumnDrawerOpen(false);
        }}
        direction="left"
        size="340px"
      >
        <div className="relative flex items-stretch bg-[#202022] h-full w-full overflow-hidden">
          <LeftColumn
            viewportHeight={viewportHeight}
            isForceOpen={isLeftColumnDrawerOpen}
          />
        </div>
      </Drawer>
      <div
        className="page-bg relative w-full xl:px-16 xl:py-8 flex justify-center items-center"
        style={{
          height: `${viewportHeight}px`,
          maxHeight: `${viewportHeight}px`,
        }}
      >
        <div className="relative flex items-stretch bg-[#202022] h-full w-full max-w-7xl p-0 md:p-1 border xl:rounded-3xl overflow-hidden z-50">
          <LeftColumn
            viewportHeight={
              viewportWidth > 1280 ? viewportHeight - 64 : viewportHeight
            }
          />
          <RightColumn>{children}</RightColumn>
        </div>
      </div>
    </div>
  );
}

export default MyndersContainer;
