import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import useFirebase from "./useFirebase";
import useMynders from "./useMynders";
import { StickyNote } from "../types/sticky-note";

function useFetchNotes() {
  const { folderId, decryptData } = useMynders();
  const { firestore } = useFirebase();

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>();

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
        const docs: StickyNote[] = snapshot.docs?.map(
          (doc) =>
            ({
              _id: doc.id,
              ...doc.data(),
            } as StickyNote)
        );

        const serialzedNotes = docs.map((doc) => {
          let title = doc.title || "";
          let body = doc.body;

          if (doc.body.length > 0 && doc.author_id !== "ADMIN") {
            title = title.length > 0 ? decryptData!(title) : title;
            body = body.length > 0 ? decryptData!(body) : body;
          }

          return {
            ...doc,
            title,
            body,
          };
        });
        setStickyNotes(serialzedNotes);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    // Cleanup on unmount
    return unsubscribe;
  }, []);

  return stickyNotes;
}

export default useFetchNotes;
