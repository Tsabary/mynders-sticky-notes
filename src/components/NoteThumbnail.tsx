import { FaTrash } from "react-icons/fa";
import { remark } from "remark";
import strip from "strip-markdown";

import { StickyNote } from "../types/sticky-note";
import { useEffect, useState } from "react";

function NoteThumbnail({
  note,
  isCurrent,
  setCurrent,
  setIsNoteDrawerVisible,
  setSelectedNote,
  handleDeleteNote,
}: {
  note: StickyNote;
  isCurrent: boolean;
  setCurrent: () => void;
  setIsNoteDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  handleDeleteNote: (noteToDelete: StickyNote) => Promise<void>;
}) {
  const [string, setString] = useState("");
  let pressTimer: NodeJS.Timeout;

  const startPress = () => {
    pressTimer = setTimeout(() => {
      setIsNoteDrawerVisible(true);
      setSelectedNote(note);
    }, 1000);
  };

  const endPress = () => {
    clearTimeout(pressTimer);
  };

  useEffect(() => {
    (async () => {
      const file = await remark().use(strip).process(note.body);
      setString(String(file).replace(/&#x[0-9A-Fa-f]+;/g, ' '));
    })();
  }, [note]);

  return (
    <div
      onClick={setCurrent}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      className={[
        "aspect-square w-24 h-24 overflow-hidden bg-black/10 rounded p-2 text-sm break-words cursor-pointer flex items-start justify-start text-start transition-colors ease-in-out hover:bg-blue-900/10 flex-shrink-0 relative",
        isCurrent ? "border border-dashed border-black/60" : "",
      ].join(" ")}
      style={{ hyphens: "auto" }}
    >
      {string.length > 40 ? string.slice(0, 38) + ".." : string}
      {/* Child button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteNote(note);
        }}
        className="absolute bottom-1 right-1 p-1.5 bg-black/40 rounded hidden md:block opacity-35 hover:opacity-80 transition-opacity ease-in-out"
      >
        <FaTrash className="h-3 w-3 text-black/40" />
      </button>
    </div>
  );
}

export default NoteThumbnail;
