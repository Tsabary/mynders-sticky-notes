import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useFirebase from "../hooks/useFirebase";
import { StickyNote } from "../types/sticky-note";
import { handleDeleteNote } from "../helpers/handleDeleteNote";
import { Button } from "./ui/button";

function DeleteNoteDialog({
  note,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  onDelete,
}: {
  note: StickyNote;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
}) {
  const { firestore } = useFirebase();

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently delete this note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            className="mt-2"
            onClick={async () => {
              await handleDeleteNote(firestore!, note);
              onDelete?.();
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteDialog;
