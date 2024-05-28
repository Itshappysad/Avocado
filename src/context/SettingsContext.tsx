import { ReactNode, createContext, useContext, useState } from "react";
import { Settings } from "../components/Settings";

type SettingsProviderProps = {
  children: ReactNode;
};

type SettingsContext = {
  openSet: () => void;
  closeSet: () => void;
};
const SettingsContext = createContext({} as SettingsContext);

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openSet = () => setIsOpen(true);
  const closeSet = () => setIsOpen(false);

  return (
    <SettingsContext.Provider
      value={{
        openSet,
        closeSet,
      }}
    >
      {children}
      <Settings isOpen={isOpen} />
    </SettingsContext.Provider>
  );
}
