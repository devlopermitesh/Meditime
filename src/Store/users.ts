import {create} from "zustand"

interface UserState {
    user: {
        Id: string;
        name: string;
        email: string;
    };
    setUserId: (id: string, name: string, email: string) => void;
    logout: () => void;
}

export const useUser = create<UserState>((set) => ({
    user: {
        Id: "",
        name: "",
        email: "",
    },
    setUserId: (id, name, email) => set({ user: { Id: id, name: name, email: email } }),
    logout: () => set({ user: { Id: "", name: "", email: "" } }),
}));
