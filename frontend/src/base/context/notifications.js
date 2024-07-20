import { createContextStore } from "../helpers/createContext";
import { useContext } from "react";

export const NotificationsContext = createContextStore({ shouldUpdate: false });
export const useUpdateNotifications = () => useContext(NotificationsContext.DispatchContext);
export const useNotifications = () => useContext(NotificationsContext.State);