import { createContextStore } from "../helpers/createContext";
import { useContext } from "react";

export const TemplatesContext = createContextStore({ shouldUpdate: false });
export const useUpdateTemplates = () => useContext(TemplatesContext.DispatchContext);
export const useTemplates = () => useContext(TemplatesContext.State);