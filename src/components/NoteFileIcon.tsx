import { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { StickyNote } from "../types/sticky-note";
import NoteContextMenu from "./NoteContextMenu";
import DeleteNoteDialog from "./DeleteNoteDialog";

function NoteFileIcon({
  note,
  setSelectedNote,
  setIsNoteMenuDrawerVisible,
  setIsNoteDrawerVisible,
}: {
  note: StickyNote;
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  setIsNoteMenuDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNoteDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  let pressTimer: NodeJS.Timeout;

  const startPress = (note: StickyNote) => {
    pressTimer = setTimeout(() => {
      setIsNoteMenuDrawerVisible(true);
      setSelectedNote(note);
    }, 1000);
  };

  const endPress = () => {
    clearTimeout(pressTimer);
  };

  return (
    <ContextMenu>
      <NoteContextMenu
        note={note}
        showDeleteDialog={() => setIsDeleteDialogOpen(true)}
      />
      <DeleteNoteDialog
        note={note}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />
      <ContextMenuTrigger
        onTouchStart={() => startPress(note)}
        onTouchEnd={endPress}
        onTouchCancel={endPress}
        onContextMenuCapture={() => setSelectedNote(note)}
        onClick={() => {
          setSelectedNote(note);
          setIsNoteDrawerVisible(true);
        }}
        className="w-24 rounded-md h-auto cursor-pointer bg-white/50 p-2 shadow-lg"
      >
        <FileIcon
          type="document"
          // extension="txt"
          {...defaultStyles["txt"]}
          color="#f2ca52"
        />
        <p className="text-sm mt-1 leading-4">
          {note.title.length > 0 ? note.title : "(no title)"}
        </p>
      </ContextMenuTrigger>
    </ContextMenu>
  );
}

export default NoteFileIcon;
