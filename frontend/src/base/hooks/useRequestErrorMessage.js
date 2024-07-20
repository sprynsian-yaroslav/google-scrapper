import {useCallback, useState} from "react";

/**
 *
 *
 * @returns {[string, {onCatchError: any, update: any}]}
 */
export const useRequestErrorMessage = (initial = "") => {
    const [alert, update] = useState(initial);

    const onCatchError = useCallback(error => {
        update(error.message);
        return Promise.reject(error)
    }, []);

    return [alert, {onCatchError, update}]
};
