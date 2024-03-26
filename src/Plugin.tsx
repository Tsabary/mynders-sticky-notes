import "./styles.css";
import React, { useEffect, useRef, useState } from "react";
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
import NotesSlider from "./NotesSlider";
import NoteMenuDrawer from "./NoteMenuDrawer";

function Plugin(props: MyndersAppProps) {
  const { user, folderId, encryptData, decryptData } = props;

  const { firestore, analytics } = useFirebase();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleDeleteNote = async (noteToDelete:StickyNote) => {
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

  const handleNoteBodyChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newBody = event.target.value;
    setNoteBody(newBody);
    if (currentNote?._id && firestore) {
      saveNoteBodyRef.current(currentNote._id, newBody, firestore);
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
          setStickyNotes(
            docs.map((doc) => {
              const decryptdBody = doc.body.length ? decryptData(doc.body) : "";

              return {
                ...doc,
                body: decryptdBody,
              };
            })
          );
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
  }, [currentNote]);

  return (
    <div
      className={[
        "absolute z-20 top-0 right-0 bottom-0 left-0 pl-4 md:px-4 flex gap-2 flex-col md:flex-row",
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
      {currentNote && (
        <textarea
          ref={textAreaRef}
          className="h-full flex-1 bg-transparent pl-1 pr-4 py-0 md:p-4 border-none appearance-none focus:outline-none focus:ring-0 resize-none placeholder-black/30"
          placeholder="Take a note.."
          value={noteBody}
          onChange={handleNoteBodyChange}
        />
      )}
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
