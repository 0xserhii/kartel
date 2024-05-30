import { createContext, useContext, useState } from 'react';

type TabProviderState = {
  tab: string;
  setTab: (tab: string) => void;
};

type TabProviderProps = {
  children: React.ReactNode;
  defaultTab?: string;
  storageKey?: string;
};

const initialState: TabProviderState = {
  tab: 'home',
  setTab: () => null
};

const TabProviderContext = createContext<TabProviderState>(initialState);

export default function ContextProvider({
  children,
  defaultTab = 'home',
  storageKey = 'game-ui-tab',
  ...props
}: TabProviderProps) {
  const [tab, setTab] = useState<string>(
    () => (localStorage.getItem(storageKey) as string) || defaultTab
  );

  const value = {
    tab,
    setTab: (tab: string) => {
      localStorage.setItem(storageKey, tab);
      setTab(tab);
    }
  };

  return (
    <TabProviderContext.Provider {...props} value={value}>
      {children}
    </TabProviderContext.Provider>
  );
}

export const useTab = () => {
  const context = useContext(TabProviderContext);

  if (context === undefined)
    throw new Error('useTab must be used within a TabProvider');

  return context;
};
