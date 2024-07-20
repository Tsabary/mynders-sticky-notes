import "./styles.css";
import { useState } from "react";
import {
  PluginProps,
  NativePluginProps,
  generateBackgroundPattern,
} from "mynders";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

import { StickyNote } from "./types/sticky-note";
import { FirebaseProvider } from "./context/firebase-context";
import NoteMenuDrawer from "./components/NoteMenuDrawer";
import NoteContentDrawer from "./components/NoteContentDrawer";
import { MyndersProvider } from "./context/mynders-context";
import NoteFileIcon from "./components/NoteFileIcon";
import Toolbar from "./components/Toolbar";
import useFetchNotes from "./hooks/useFetchNotes";
import DeleteNoteDialog from "./components/DeleteNoteDialog";

function Plugin() {
  const notes = useFetchNotes();
  const [selectedNote, setSelectedNote] = useState<StickyNote>();
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);
  const [isNoteMenuDrawerVisible, setIsNoteMenuDrawerVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [orderBy, setOrderBy] = useState<"created" | "updated" | "name">(
    "updated"
  );
  const [orderDirection, setOrderDirection] = useState<
    "ascending" | "descending"
  >("descending");

  const sortedNotes = notes?.slice().sort((a, b) => {
    let compareValue = 0;
    switch (orderBy) {
      case "created":
        compareValue = a.created_at.seconds - b.created_at.seconds;
        break;
      case "updated":
        compareValue = a.placement - b.placement;
        break;
      case "name":
        compareValue = a.title.localeCompare(b.title);
        break;
      default:
        break;
    }
    return orderDirection === "ascending" ? compareValue : -compareValue;
  });

  return (
    <>
      <Toaster position="top-right" richColors />
      <DeleteNoteDialog
        note={selectedNote}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onDelete={() => {
          setIsNoteDrawerVisible(false);
          setIsDeleteDialogOpen(false);
          setSelectedNote(undefined);
        }}
      />

      <div
        className="absolute z-20 inset-0 px-2 md:px-6 bg-white flex flex-col gap-4"
        style={generateBackgroundPattern()}
      >
        <Toolbar
          setSelectedNote={setSelectedNote}
          setIsNoteDrawerVisible={setIsNoteDrawerVisible}
          orderDirection={orderDirection}
          setOrderBy={setOrderBy}
          setOrderDirection={setOrderDirection}
        />
        <ScrollArea className="flex-1">
          <div className="flex flex-wrap gap-4 h-max">
            {sortedNotes?.map((note) => (
              <NoteFileIcon
                note={note}
                setSelectedNote={setSelectedNote}
                setIsNoteMenuDrawerVisible={setIsNoteMenuDrawerVisible}
                setIsNoteDrawerVisible={setIsNoteDrawerVisible}
                key={note._id}
              />
            ))}
          </div>
        </ScrollArea>
        <NoteMenuDrawer
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          isNoteMenuDrawerVisible={isNoteMenuDrawerVisible}
          setIsNoteMenuDrawerVisible={setIsNoteMenuDrawerVisible}
        />

        <NoteContentDrawer
          note={selectedNote}
          setSelectedNote={setSelectedNote}
          isNoteDrawerVisible={isNoteDrawerVisible}
          setIsNoteDrawerVisible={setIsNoteDrawerVisible}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </div>
    </>
  );
}

export default (props: PluginProps & NativePluginProps) => {
  return (
    <MyndersProvider {...props}>
      <FirebaseProvider firebaseConfig={props.firebaseConfig}>
        <Plugin />
      </FirebaseProvider>
    </MyndersProvider>
  );
};
