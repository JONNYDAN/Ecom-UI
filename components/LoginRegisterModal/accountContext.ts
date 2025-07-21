import { createContext } from "react";

interface AccountContextType {
  switchToRegister: () => void;
  switchToLogin?: () => void; 
}

export const AccountContext = createContext<AccountContextType>({
  switchToRegister: () => {},
});
