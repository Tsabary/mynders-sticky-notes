import { StickyNote } from "../types/sticky-note";
import { Drawer, DrawerContent } from "./ui/drawer";
import useFirebase from "../hooks/useFirebase";
import { handleDeleteNote } from "../helpers/handleDeleteNote";
import { handleCopy } from "../helpers/handleCopyNote";

function NoteMenuDrawer({
  selectedNote,
  setSelectedNote,
  isNoteMenuDrawerVisible,
  setIsNoteMenuDrawerVisible,
}: {
  selectedNote: StickyNote | undefined;
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  isNoteMenuDrawerVisible: boolean;
  setIsNoteMenuDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { firestore } = useFirebase();

  return (
    <Drawer
      open={isNoteMenuDrawerVisible}
      onOpenChange={(v) => {
        setIsNoteMenuDrawerVisible(v);
        if (!v) setSelectedNote(undefined);
      }}
    >
      <DrawerContent className="flex md:!hidden flex-col gap-1 items-stretch py-2">
        <button
          onClick={() => {
            if (!selectedNote) return;
            handleCopy(selectedNote);
            setIsNoteMenuDrawerVisible?.(false);
            setSelectedNote?.(undefined);
          }}
          className="text-gray-500 px-4 py-2"
        >
          Copy
        </button>

        <button
          onClick={async () => {
            if (!selectedNote) return;
            await handleDeleteNote(firestore!, selectedNote);
            setIsNoteMenuDrawerVisible(false);
            setSelectedNote(undefined);
          }}
          className="text-red-600 px-4 py-2"
        >
          Delete Note
        </button>
      </DrawerContent>
    </Drawer>
  );
}

export default NoteMenuDrawer;
