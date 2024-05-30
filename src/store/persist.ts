import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { produce } from "immer";

export type TPersistState = {
    userData: {
        username: string;
        userEmail: string;
        _id: string;
    };
};


export type TPersistStore = {
    app: TPersistState;
    actions: {
        init: () => Promise<void>;
        setUserData: (params: any) => Promise<void>;
    };
};

const initialState: TPersistState = {
    userData: { username: "", userEmail: "", _id: "" },
};


export const usePersistStore = create<TPersistStore>()(
    devtools(
        immer(
            persist(
                (set, get) => ({
                    app: initialState,
                    actions: {
                        async init() {
                            set(
                                produce((draft) => {
                                    draft.app = initialState;
                                })
                            );
                        },
                        async setUserData(params) {
                            set(
                                produce((draft) => {
                                    draft.app.userData = params;
                                })
                            );
                        },
                    },
                }),
                {
                    name: "persist-store",
                    partialize: (state) => ({ app: state.app }),
                }
            )
        )
    )
);
