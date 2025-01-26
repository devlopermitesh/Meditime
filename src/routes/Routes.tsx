import { AppwriteContext } from "../Appwrite/AppwriteContext";
import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Loading from "../screens/Loading";


const Routes = ():React.JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {appwrite, isloggedIn,setIsloggedIn} = useContext(AppwriteContext)
    useEffect(() => {
        appwrite
        .getUser()
        .then(response => {
          setIsLoading(false)
          if (response) {
              setIsloggedIn(true)
          }
        })
        .catch(_ => {
          setIsLoading(false)
          setIsloggedIn(false)
        })
      }, [appwrite, setIsloggedIn])
      
      if (isLoading) {
          return <Loading />
      }
      console.log("isloggedIn",isloggedIn)
return(
    <NavigationContainer>
  {isloggedIn?<AppStack />:<AuthStack />}

    </NavigationContainer>
)
}

export default Routes