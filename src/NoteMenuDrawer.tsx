import { useMemo } from "react";
import Drawer from "react-modern-drawer";
import { toast } from "react-toastify";
import "react-modern-drawer/dist/index.css";
import { StickyNote } from "./types/sticky-note";

function NoteMenuDrawer({
  selectedNote,
  setSelectedNote,
  isNoteDrawerVisible,
  setIsNoteDrawerVisible,
  handleDeleteNote,
}: {
  selectedNote: StickyNote | undefined;
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  isNoteDrawerVisible: boolean;
  setIsNoteDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteNote: (noteToDelete:StickyNote) => Promise<void>;
}) {
  const drawerSize = useMemo(() => {
    const row = 48;
    if (!selectedNote) return 0;
    return selectedNote.body.length ? row * 2 : row;
  }, [selectedNote]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedNote!.body!);
    toast("Note copied!");
  };

  if (!selectedNote) return null;
  return (
    <Drawer
      open={!!isNoteDrawerVisible}
      onClose={() => {
        setIsNoteDrawerVisible(false);
      }}
      direction="bottom"
      size={`${drawerSize + 16}px`}
      className="md:hidden relative flex flex-col justify-center py-2"
    >
      {selectedNote.body && (
        <button
          onClick={() => {
            handleCopy();
            setIsNoteDrawerVisible?.(false);
            setSelectedNote?.(undefined);
          }}
          className="text-gray-500 px-4 py-2"
        >
          Copy
        </button>
      )}
      <button
        onClick={async () => {
          await handleDeleteNote(selectedNote);
          setIsNoteDrawerVisible(false);
          setSelectedNote(undefined);
        }}
        className="text-red-600 px-4 py-2"
      >
        Delete Note
      </button>
    </Drawer>
  );
}

export default NoteMenuDrawer;
