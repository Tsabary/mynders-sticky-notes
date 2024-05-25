import React, { createContext } from "react";

import { PluginProps, NativePluginProps } from "mynders";

type CombinedProps = Partial<PluginProps & NativePluginProps>;

type MyndersContextProps = CombinedProps;
export const MyndersContext = createContext<MyndersContextProps>({});

interface MyndersProviderProps
  extends React.PropsWithChildren<{}>,
    CombinedProps {}

export const MyndersProvider: React.FC<MyndersProviderProps> = ({
  children,
  user,
  folderId,
  encryptData,
  encryptFile,
  decryptData,
  decryptFile,
  isLosingFocus,
  setLocalStorage,
  getLocalStorage,
}) => {
  return (
    <MyndersContext.Provider
      value={{
        user,
        folderId,
        encryptData,
        encryptFile,
        decryptData,
        decryptFile,
        isLosingFocus,
        setLocalStorage,
        getLocalStorage,
      }}
    >
      {children}
    </MyndersContext.Provider>
  );
};
