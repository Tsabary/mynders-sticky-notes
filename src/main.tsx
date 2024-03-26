import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { MyndersFolder, generateBackgroundPattern } from "mynders";

import Plugin from "./Plugin.tsx";
import MyndersContainer from "./layout/MyndersContainer.tsx";
import firebaseConfig from "./firebase.ts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const ContentfullApp = () => {
  const folder: MyndersFolder = {
    _id: "dummy-folder-id",
    admin: "Aa1234",
    name: "My personal folder",
  };
  const [notesByFolder, setNotesByFolder] = useState<Map<string, any[]>>(
    new Map()
  );
  const areCompletedVisible = true;
  const selectedFolders: MyndersFolder[] = [folder];

  return (
    <Plugin
      firebaseConfig={firebaseConfig}
      user={{ _id: "Aa1234", email: "user@example.com", storage_usage: 4500 }}
      folderId="dummy-folder-id"
      encryptData={(data) => "mock encrypted data: " + data}
      encryptFile={() =>
        Promise.resolve(new Blob([], { type: "application/octet-stream" }))
      }
      decryptData={(data) => "Mock decrypted data: " + data}
      decryptFile={() =>
        Promise.resolve(new File([""], "dummy.txt", { type: "text/plain" }))
      }
      notesByFolder={notesByFolder}
      setNotesByFolder={setNotesByFolder}
      areCompletedVisible={areCompletedVisible}
      selectedFolders={selectedFolders}
      isNavigatedFrom={() => false}
      folder={folder}
    />
  );
};

root.render(
  <React.StrictMode>
    <div
      style={{
        height: "100vh",
        ...generateBackgroundPattern("#e6ecf7", "#459af7"),
      }}
    >
      <MyndersContainer>
        <ContentfullApp />
      </MyndersContainer>
    </div>
  </React.StrictMode>
);
