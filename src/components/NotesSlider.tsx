import React, { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi2";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import NoteThumbnail from "./NoteThumbnail";
import { StickyNote } from "../types/sticky-note";

function NotesSlider({
  createNewNote,
  currentNote,
  stickyNotes,
  setCurrentNote,
  setIsNoteDrawerVisible,
  setSelectedNote,
  handleDeleteNote,
}: {
  createNewNote: () => void;
  currentNote: StickyNote | undefined;
  stickyNotes: StickyNote[] | undefined;
  setCurrentNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  setIsNoteDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  handleDeleteNote: (noteToDelete: StickyNote) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (hover) {
      timer = setTimeout(() => {
        setIsExpanded(true);
      }, 300); // Delay for hover effect
    }

    return () => clearTimeout(timer); // Cleanup on unmount or hover state change
  }, [hover]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 w-full overflow-hidden transition-height duration-300 ease-in-out ${
        isExpanded ? "max-h-screen pt-4 pl-4" : "max-h-24 pt-2"
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`${
          isExpanded ? "hidden" : "flex"
        } justify-center items-center w-full`}
        onClick={toggleExpand}
      >
        <ArrowDown className="h-6 w-6 cursor-pointer text-black/50" />
      </div>
      <div
        className={`flex gap-2 w-full overflow-x-auto no-scrollbar ${
          isExpanded ? "h-max" : "hidden"
        }`}
      >
        <button
          onClick={createNewNote}
          className="aspect-square w-24 h-24 bg-black/10 rounded p-2 text-sm cursor-pointer flex justify-center items-center flex-shrink-0"
        >
          <HiPlus className="h-12 w-12 text-black/40" />
        </button>
        {stickyNotes?.map((note) => (
          <NoteThumbnail
            note={note}
            isCurrent={note._id === currentNote?._id}
            setCurrent={() => setCurrentNote(note)}
            setIsNoteDrawerVisible={setIsNoteDrawerVisible}
            setSelectedNote={setSelectedNote}
            handleDeleteNote={handleDeleteNote}
            key={note._id}
          />
        ))}
      </div>
      <div
        className={`${
          isExpanded ? "flex" : "hidden"
        } justify-center items-center w-full mt-2`}
        onClick={toggleExpand}
      >
        <ArrowDown className="h-6 w-6 cursor-pointer transform rotate-180 transition-transform duration-300 ease-in-out text-black/50" />

      </div>
    </div>
  );
}

export default NotesSlider;
