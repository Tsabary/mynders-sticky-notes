import { toast } from "sonner";
import { StickyNote } from "../types/sticky-note";

export const handleCopy = (note: StickyNote) => {
  navigator.clipboard.writeText(note.body!);
  toast.success("Note copied!");
};
