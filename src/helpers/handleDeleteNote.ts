import { Firestore, deleteDoc, doc } from "firebase/firestore";
import { StickyNote } from "../types/sticky-note";
import handleError from "./handleError";

export const handleDeleteNote = async (
  firestore: Firestore,
  note: StickyNote
) => {
  try {
    const noteRef = doc(
      firestore!,
      "plugins-data/com.mynders.sticky_notes/notes",
      note._id
    );
    deleteDoc(noteRef);
  } catch (err: unknown) {
    handleError(err, "Failed to delete note: ");
  }
};
