import React from "react";
import ReactDOM from "react-dom/client";
import { Folder, generateBackgroundPattern } from "mynders";

import Plugin from "./Plugin.tsx";
import MyndersContainer from "./layout/MyndersContainer.tsx";
import firebaseConfig from "./firebase.ts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const ContentfullApp = () => {
  const folder: Folder = {
    _id: "3mFP53W9m8t0ZCK4C2o6",
    admin: "Aa1234",
    name: "My personal folder",
  };

  return (
    <Plugin
      firebaseConfig={firebaseConfig}
      user={{
        _id: "Aa1234",
        email: "user@example.com",
        activated_plugins: [
          {
            plugin_id: "com.mynders.sticky_notes",
            plugin_name: "Sticky Notes",
            plugin_icon: "",
          },
        ],
        storage_usage: 4500,
      }}
      folderId={folder._id}
      encryptData={(data) => "mock encrypted data: " + data}
      encryptFile={() =>
        Promise.resolve(new Blob([], { type: "application/octet-stream" }))
      }
      decryptData={(data) => "Mock decrypted data: " + data}
      decryptFile={() =>
        Promise.resolve(new File([""], "dummy.txt", { type: "text/plain" }))
      }
      isLosingFocus={false}
      isHome={false}
      setLocalStorage={() => {}}
      getLocalStorage={() => ""}
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
