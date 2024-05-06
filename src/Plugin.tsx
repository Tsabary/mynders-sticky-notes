import "./styles.css";
import "react-modern-drawer/dist/index.css";
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
  PluginProps,
  NativePluginProps,
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

function Plugin(props: PluginProps) {
  const { user, folderId, encryptData, decryptData } = props;

  const { firestore, analytics } = useFirebase();

  const textAreaRef = useRef<MDXEditorMethods>(null);

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>();
  const [currentNote, setCurrentNote] = useState<StickyNote>();
  const [noteBody, setNoteBody] = useState("");

  const [selectedNote, setSelectedNote] = useState<StickyNote>();
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  const saveNoteBodyRef = useRef(
    debounce(
      async (
        noteId: string,
        noteAuthor: string,
        body: string,
        firestore: Firestore
      ) => {
        if (!noteId) return;
        const noteRef = doc(
          firestore!,
          "plugins-data/com.mynders.sticky_notes/notes",
          noteId
        );
        const update: {
          body: string;
          placement: number;
          author_id?: string;
        } = {
          body: encryptData(body),
          placement: new Date().getTime(),
        };
        if (noteAuthor === "ADMIN") {
          update["author_id"] = user!._id;
        }
        await updateDoc(noteRef, update);
      },
      3000
    )
  );

  const createNewNote = async () => {
    if (!!currentNote && noteBody.length === 0) return;
    try {
      const newNoteRef = doc(
        collection(firestore!, "plugins-data/com.mynders.sticky_notes/notes")
      );

      await setDoc(newNoteRef, {
        author_id: user!._id,
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
      if (window.confirm("Are you sure you want to delete this note?")) {
        // Reference to the note
        const noteRef = doc(
          firestore!,
          "plugins-data/com.mynders.sticky_notes/notes",
          noteToDelete._id
        );
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
      saveNoteBodyRef.current(
        currentNote._id,
        currentNote.author_id,
        newNote,
        firestore
      );
    }
  };

  useEffect(() => {
    // Adjust the query as needed, for example using `where` for filtering
    const q = query(
      collection(firestore!, "plugins-data/com.mynders.sticky_notes/notes"),
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

export default (props: PluginProps & NativePluginProps) => {
  return (
    <FirebaseProvider firebaseConfig={props.firebaseConfig}>
      <Plugin {...props} />
    </FirebaseProvider>
  );
};
