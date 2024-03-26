import { FaTrash } from "react-icons/fa";
import { StickyNote } from "./types/sticky-note";

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
  handleDeleteNote: (noteToDelete:StickyNote) => Promise<void>;
}) {
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

  return (
    <div
      onClick={setCurrent}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      className={[
        "aspect-square w-24 bg-black/10 rounded p-2 text-sm break-words cursor-pointer flex items-start justify-start text-start transition-colors ease-in-out hover:bg-blue-900/10 flex-shrink-0 relative", // Add 'relative' here for positioning child absolutely
        isCurrent ? "border border-dashed border-black/60" : "",
      ].join(" ")}
      style={{ hyphens: "auto" }}
    >
      {note.body.length > 40 ? note.body.slice(0, 38) + ".." : note.body}
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
