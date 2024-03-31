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
