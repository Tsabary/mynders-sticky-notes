import { StickyNote } from "../types/sticky-note";
import { ContextMenuContent, ContextMenuItem } from "./ui/context-menu";
import { handleCopy } from "../helpers/handleCopyNote";

function NoteContextMenu({
  note,
  showDeleteDialog,
}: {
  note: StickyNote | undefined;
  showDeleteDialog: () => void;
}) {
  return (
    <ContextMenuContent className="hidden md:!block">
      <ContextMenuItem
        onClick={() => {
          if (!note) return;
          handleCopy(note);
        }}
      >
        Copy content
      </ContextMenuItem>
      <ContextMenuItem onClick={showDeleteDialog}>Delete</ContextMenuItem>
    </ContextMenuContent>
  );
}

export default NoteContextMenu;
