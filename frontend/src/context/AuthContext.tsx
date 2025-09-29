import { createContext } from "react";
import type{ AuthContextType } from "../types/authtypes";

// Only create and export the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;