import {useCallback, useState} from "react";


/**
 *
 * @returns {[boolean, { registerPromise: any, toggle: any, disable: any, enable: any}]}
 */
export const useLoading = ( defaultValue = false) => {
    const [loading, updateLoading] = useState(defaultValue);

    const enable = useCallback(() => updateLoading(true), []);

    const disable = useCallback(() => updateLoading(false), []);

    const toggle = useCallback(() => updateLoading(state => !state), []);

    const registerPromise = useCallback(async (promise) => {
        enable();

        return promise.finally(disable)
    }, [enable, disable]);

    return [loading, {registerPromise, toggle, update: updateLoading, disable, enable}]
};
