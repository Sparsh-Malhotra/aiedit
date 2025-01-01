import {StoreApi} from "zustand";
import React from "react";

export const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
    getStore: (initial: TInitial) => TStore
) => {
    const Context = React.createContext<TStore | null>(null);

    const Provider = (props: {
        children?: React.ReactNode;
        initialValue: TInitial;
    }) => {
        const [store, setStore] = React.useState<TStore | null>(null);

        React.useEffect(() => {
            setStore(getStore(props.initialValue));
        }, [props.initialValue]);

        if (!store) return null;

        return <Context.Provider value={store}>{props.children}</Context.Provider>;
    };

    return {
        useContext: () => React.useContext(Context),
        Context,
        Provider,
    };
};