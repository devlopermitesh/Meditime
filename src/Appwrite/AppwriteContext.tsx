import { createContext, ReactNode } from "react";
import Appwrite from "./Service"
import { FC, PropsWithChildren, useState } from "react";

type AppwriteContextType = {
    appwrite: Appwrite,
    isloggedIn: boolean,
    setIsloggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppwriteContext = createContext<AppwriteContextType>({
    appwrite: new Appwrite(),
    isloggedIn: false,
    setIsloggedIn: () => {}
});


const AppwriteProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isloggedIn, setIsloggedIn] = useState(false);
    const value: AppwriteContextType = {
        appwrite: new Appwrite(),
        isloggedIn,
        setIsloggedIn
    };

    return (
        <AppwriteContext.Provider value={value}>
            {children}
        </AppwriteContext.Provider>
    );


}

export default AppwriteProvider