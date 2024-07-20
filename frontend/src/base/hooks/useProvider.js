import {useContext} from "react";

export const useStatefullProvider = (Provider) => {
    return [
        useContext(Provider.State),
        useContext(Provider.DispatchContext),
    ]
};

export const useStatelessProvider = (Provider) => {
    return [
        useContext(Provider.State),
    ]
};


