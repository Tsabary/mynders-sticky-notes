import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";
import useMynders from "../hooks/useMynders";
import useFirebase from "../hooks/useFirebase";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import handleError from "../helpers/handleError";
import { StickyNote } from "../types/sticky-note";
import { cn } from "../lib/utils";

function Toolbar({
  setSelectedNote,
  setIsNoteDrawerVisible,
  orderDirection,
  setOrderBy,
  setOrderDirection,
}: {
  setSelectedNote: React.Dispatch<React.SetStateAction<StickyNote | undefined>>;
  setIsNoteDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  orderDirection: "ascending" | "descending";
  setOrderBy: React.Dispatch<
    React.SetStateAction<"created" | "updated" | "name">
  >;
  setOrderDirection: React.Dispatch<
    React.SetStateAction<"ascending" | "descending">
  >;
}) {
  const { user, folderId } = useMynders();
  const { firestore, analytics } = useFirebase();

  const createNewNote = async () => {
    try {
      const newNoteRef = doc(
        collection(firestore!, "plugins-data/com.mynders.sticky_notes/notes")
      );

      const newNote = {
        author_id: user!._id,
        folder_id: folderId,
        created_at: serverTimestamp(),
        placement: new Date().getTime(),
        title: "",
        body: "",
      };

      await setDoc(newNoteRef, newNote);

      setSelectedNote({
        ...newNote,
        _id: newNoteRef.id,
        created_at: new Date(),
      } as StickyNote);
      setIsNoteDrawerVisible(true);

      if (analytics) {
        logEvent(analytics, "new_sticky_note");
      }
    } catch (err: unknown) {
      handleError(err, "Failed to create a new sticky note:");
    }
  };

  return (
    <div className="flex items-center">
      <Tabs defaultValue="updated" className="flex-1">
        <TabsList>
          <button
            onClick={() => {
              setOrderDirection((curr) =>
                curr === "ascending" ? "descending" : "ascending"
              );
            }}
          >
            <ArrowDownUp
              className={cn(
                "size-4 ml-1 mr-1.5 cursor-pointer transition-transform ease-in-out",
                orderDirection === "descending" ? "rotate-180" : ""
              )}
            />
          </button>
          <TabsTrigger value="updated" onClick={() => setOrderBy("updated")}>
            Updated
          </TabsTrigger>
          <TabsTrigger value="name" onClick={() => setOrderBy("name")}>
            Name
          </TabsTrigger>
          <TabsTrigger value="created" onClick={() => setOrderBy("created")}>
            Created
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <button onClick={createNewNote} className="text-sm px-2 text-blue-600">
        + Create
      </button>
    </div>
  );
}

export default Toolbar;
