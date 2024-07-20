import {useCallback} from "react";

export const useFileToURL = () => {
    const fileToURL = useCallback((file) => {
        return URL.createObjectURL(file)
    }, []);

    return {
        fileToURL
    }
};
