import "./styles.css";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import {
  MyndersAppProps,
  MyndersNativeAppProps,
  generateBackgroundPattern,
} from "mynders";

import handleError from "./helpers/handleError";
import { StickyNote } from "./types/sticky-note";
import useFirebase from "./hooks/useFirebase";
import { FirebaseProvider } from "./context/firebase-context";
import NotesSlider from "./components/NotesSlider";
import NoteMenuDrawer from "./components/NoteMenuDrawer";
import NoteTextarea from "./components/NoteTextarea";
import { MDXEditorMethods } from "@mdxeditor/editor";

function Plugin(props: MyndersAppProps) {
  const { user, folderId, encryptData, decryptData } = props;

  const { firestore, analytics } = useFirebase();

  const textAreaRef = useRef<MDXEditorMethods>(null);

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>();
  const [currentNote, setCurrentNote] = useState<StickyNote>();
  const [noteBody, setNoteBody] = useState("");

  const [selectedNote, setSelectedNote] = useState<StickyNote>();
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  const saveNoteBodyRef = useRef(
    debounce(async (noteId: string, body: string, firestore: Firestore) => {
      if (!firestore || !noteId) return;
      const noteRef = doc(firestore, "sticky-notes", noteId);
      await updateDoc(noteRef, {
        body: encryptData(body),
        placement: new Date().getTime(),
      });
    }, 3000)
  );

  const createNewNote = async () => {
    if (!firestore) throw new Error("Firestore is not defined");
    if (!user) throw new Error("User is not authenticated");
    if (!!currentNote && noteBody.length === 0) return;
    try {
      const newNoteRef = doc(collection(firestore, "sticky-notes"));

      setDoc(newNoteRef, {
        author_id: user._id,
        folder_id: folderId,
        created_at: serverTimestamp(),
        placement: new Date().getTime(),
        body: "",
      });

      if (analytics) {
        logEvent(analytics, "new_sticky_note");
      }
    } catch (err: unknown) {
      handleError(err, "Failed to create a new sticky note:");
    }
  };

  const handleDeleteNote = async (noteToDelete: StickyNote) => {
    try {
      if (!firestore) {
        throw new Error("Firestore wasn't initialized properly");
      }

      if (window.confirm("Are you sure you want to delete this note?")) {
        // Reference to the note
        const noteRef = doc(firestore, "sticky-notes", noteToDelete._id);
        deleteDoc(noteRef);
      }
    } catch (err: unknown) {
      let message = "Failed to delete note: ";
      if (err instanceof Error) {
        message += err.message;
      }
      console.error(message);
    }
  };

  const handleNoteBodyChange = (newNote: string) => {
    setNoteBody(newNote);
    if (currentNote?._id && firestore) {
      saveNoteBodyRef.current(currentNote._id, newNote, firestore);
    }
  };

  useEffect(() => {
    if (!firestore) throw new Error("Firestore is not defined");
    if (!user) throw new Error("User is not authenticated");

    // Adjust the query as needed, for example using `where` for filtering
    const q = query(
      collection(firestore, "sticky-notes"),
      where("folder_id", "==", folderId),
      orderBy("placement", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          createNewNote();
        } else {
          const docs: StickyNote[] = snapshot.docs.map(
            (doc) =>
              ({
                _id: doc.id,
                ...doc.data(),
              } as StickyNote)
          );

          const serialzedNotes = docs.map((doc) => {
            let body = doc.body;
            if (doc.body.length > 0 && doc.author_id !== "ADMIN") {
              body = decryptData(doc.body);
            }

            return {
              ...doc,
              body,
            };
          });
          setStickyNotes(serialzedNotes);
        }
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!stickyNotes) return;
    const lastNote = stickyNotes[0];
    setCurrentNote(lastNote);
  }, [stickyNotes]);

  useEffect(() => {
    if (!currentNote) return;
    setNoteBody(currentNote.body);
    textAreaRef.current?.focus();
    textAreaRef.current?.setMarkdown(currentNote.body);
  }, [currentNote]);

  return (
    <div
      className={[
        "absolute z-20 top-0 right-0 bottom-0 left-0 md:px-4 flex gap-2 flex-col",
      ].join(" ")}
      style={generateBackgroundPattern("#fdf6b2", "#f2ca52")}
    >
      <NoteMenuDrawer
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        isNoteDrawerVisible={isNoteDrawerVisible}
        setIsNoteDrawerVisible={setIsNoteDrawerVisible}
        handleDeleteNote={handleDeleteNote}
      />
      <NotesSlider
        createNewNote={createNewNote}
        currentNote={currentNote}
        stickyNotes={stickyNotes}
        setCurrentNote={setCurrentNote}
        setIsNoteDrawerVisible={setIsNoteDrawerVisible}
        setSelectedNote={setSelectedNote}
        handleDeleteNote={handleDeleteNote}
      />
      <div className="flex-1 overflow-y-auto md:r-2">
        {currentNote && (
          <NoteTextarea
            textAreaRef={textAreaRef}
            noteBody={noteBody}
            setNoteBody={handleNoteBodyChange}
          />
        )}
      </div>
    </div>
  );
}

export default (props: MyndersAppProps & MyndersNativeAppProps) => {
  return (
    <FirebaseProvider firebaseConfig={props.firebaseConfig}>
      <Plugin {...props} />
    </FirebaseProvider>
  );
};
