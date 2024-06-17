import { useState } from "react";
import { StickyNote } from "../types/sticky-note";
import { Drawer, DrawerContent } from "./ui/drawer";
import { handleCopy } from "../helpers/handleCopyNote";
import DeleteNoteDialog from "./DeleteNoteDialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      {selectedNote && (
        <DeleteNoteDialog
          note={selectedNote}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          onDelete={() => {
            setSelectedNote(undefined);
            setIsNoteMenuDrawerVisible(false);
          }}
        />
      )}
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
              setIsNoteMenuDrawerVisible(false);
              setSelectedNote?.(undefined);
            }}
            className="text-gray-500 px-4 py-2"
          >
            Copy
          </button>

          <button
            onClick={() => {
              setIsDeleteDialogOpen(true);
            }}
            className="text-red-600 px-4 py-2"
          >
            Delete Note
          </button>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NoteMenuDrawer;
