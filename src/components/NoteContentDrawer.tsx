import "@mdxeditor/editor/style.css";
import { generateBackgroundPattern } from "mynders";
import { debounce } from "lodash";
import { Firestore, doc, updateDoc } from "firebase/firestore";
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  tablePlugin,
  codeBlockPlugin,
  // toolbarPlugin,
  // UndoRedo,
  // BoldItalicUnderlineToggles,
  // CodeToggle,
  // ListsToggle,
  // Separator,
} from "@mdxeditor/editor";

import { Drawer, DrawerContent, DrawerHeader } from "./ui/drawer";
import { StickyNote } from "../types/sticky-note";
import { useEffect, useRef, useState } from "react";
import useMynders from "../hooks/useMynders";
import useFirebase from "../hooks/useFirebase";
import { Button } from "./ui/button";
import { Copy, Trash2 } from "lucide-react";
import { handleCopy } from "../helpers/handleCopyNote";
import DeleteNoteDialog from "./DeleteNoteDialog";

function NoteContentDrawer({
  note,
  setSelectedNote,
  isNoteDrawerVisible,
  setIsNoteDrawerVisible,
}: {
  note?: StickyNote;
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  isNoteDrawerVisible: boolean;
  setIsNoteDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, encryptData } = useMynders();
  const { firestore } = useFirebase();
  const [noteTitle, setNoteTitle] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const textAreaRef = useRef<MDXEditorMethods>(null);

  const saveNoteRef = useRef(
    debounce(
      async (
        noteId: string,
        noteAuthor: string,
        title: string,
        body: string,
        firestore: Firestore
      ) => {
        if (!noteId) return;
        const noteRef = doc(
          firestore!,
          "plugins-data/com.mynders.sticky_notes/notes",
          noteId
        );
        const update: Partial<StickyNote> = {
          title: encryptData!(title),
          body: encryptData!(body),
          placement: new Date().getTime(),
        };
        if (noteAuthor === "ADMIN") {
          update["author_id"] = user!._id;
        }
        await updateDoc(noteRef, update);
      },
      2000
    )
  );

  const handleNoteBodyChange = (newNoteBody: string) => {
    if (!note) return;

    saveNoteRef.current(
      note._id,
      note.author_id,
      note.title || "",
      newNoteBody,
      firestore!
    );
  };

  const handleNoteTitleChange = (newNoteTitle: string) => {
    setNoteTitle(newNoteTitle);
    if (!note) return;

    saveNoteRef.current(
      note._id,
      note.author_id,
      newNoteTitle,
      note.body,
      firestore!
    );
  };

  useEffect(() => {
    if (!note) return;
    setNoteTitle(note.title || "");
    textAreaRef.current?.focus();
    textAreaRef.current?.setMarkdown(note.body);
  }, [note]);

  return (
    <>
      {note && (
        <DeleteNoteDialog
          note={note}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          onDelete={() => {
            setIsNoteDrawerVisible(false);
            setSelectedNote(undefined);
          }}
        />
      )}
      <Drawer
        open={isNoteDrawerVisible}
        onOpenChange={(v) => {
          setIsNoteDrawerVisible(v);
          if (!v) {
            setSelectedNote(undefined);
            setNoteTitle("");
          }
        }}
      >
        <DrawerContent className="h-5/6 flex flex-col items-stretch justify-stretch">
          <DrawerHeader className="flex items-center">
            <input
              value={noteTitle}
              onChange={(e) => handleNoteTitleChange(e.target.value)}
              placeholder="(no title)"
              className="text-lg font-semibold px-2 -ml-2 flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => note && handleCopy(note)}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4" />
            </Button>
          </DrawerHeader>
          <div
            className="flex-1 overflow-y-auto md:r-2"
            style={generateBackgroundPattern("#fdf6b2", "#f2ca52")}
          >
            <MDXEditor
              ref={textAreaRef}
              markdown={note?.body || ""}
              onChange={handleNoteBodyChange}
              placeholder="Take a note.."
              plugins={[
                // toolbarPlugin({
                //   toolbarContents: () => (
                //     <>
                //       <UndoRedo />
                //       <Separator />
                //       <BoldItalicUnderlineToggles />
                //       <Separator />
                //       <CodeToggle />
                //       <ListsToggle />
                //     </>
                //   ),
                // }),
                headingsPlugin(),
                quotePlugin(),
                listsPlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                linkPlugin(),
                tablePlugin(),
                codeBlockPlugin(),
              ]}
              className="flex-1"
              contentEditableClassName="pb-20"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NoteContentDrawer;
