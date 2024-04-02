import "@mdxeditor/editor/style.css";
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
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertTable,
  ListsToggle,
  Separator,
} from "@mdxeditor/editor";

function NoteTextarea({
  textAreaRef,
  noteBody,
  setNoteBody,
}: {
  textAreaRef: React.RefObject<MDXEditorMethods>;
  noteBody: string;
  setNoteBody: (newNote: string) => void;
}) {
  return (
    <MDXEditor
      ref={textAreaRef}
      markdown={noteBody}
      onChange={setNoteBody}
      placeholder="Take a note.."
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <CodeToggle />
              <CreateLink />
              <InsertTable />
              <ListsToggle />
            </>
          ),
        }),
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
    />
  );
}

export default NoteTextarea;
