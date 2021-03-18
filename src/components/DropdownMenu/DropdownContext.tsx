import { createContext, useState } from 'react';

interface DropdownContextType {
  dropdownId: string | null;
  isOpen: boolean;
  open: (id: string) => void;
  close: () => void;
}

const DEFAULT_OPEN_STATE = false;

const DropdownContext = createContext<DropdownContextType>({
  dropdownId: null,
  isOpen: DEFAULT_OPEN_STATE,
  open: () => {},
  close: () => {},
});

const DropdownContextProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(DEFAULT_OPEN_STATE);
  const [id, setId] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setId(id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setId(null);
    setIsOpen(false);
  };

  return (
    <DropdownContext.Provider
      value={{
        dropdownId: id,
        isOpen,
        open: handleOpen,
        close: handleClose,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export { DropdownContext, DropdownContextProvider };
