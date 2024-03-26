import { HiPlus } from "react-icons/hi2";
import NoteThumbnail from "./NoteThumbnail";
import { StickyNote } from "./types/sticky-note";

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
  handleDeleteNote: (noteToDelete:StickyNote) => Promise<void>;
}) {
  return (
    <div className="flex md:flex-col gap-2 py-4 md:h-full md:overflow-y-auto w-full overflow-x-auto md:overflow-x-hidden md:w-max no-scrollbar">
      <button
        onClick={createNewNote}
        className="aspect-square w-24 bg-black/10 rounded p-2 text-sm cursor-pointer flex justify-center items-center flex-shrink-0"
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
  );
}

export default NotesSlider;
