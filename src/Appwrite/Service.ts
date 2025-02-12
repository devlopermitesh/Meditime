import { Account, Client, ID } from "appwrite";
import { Config } from "react-native-config";
const APPWRITE_PROJECT_URL: string = Config.APPWRITE_PROJECT_NAME!;
const APPWRITE_PROJECT_ID: string =Config.APPWRITE_PROJECT_ID!;


const appwrite_client = new Client();

type LoginParams = {
  email: string;
  password: string;
};

type SignupParams = {
  username: string;
  email: string;
  password: string;
};

class Service {
  account: Account;
  constructor() {
    appwrite_client.setEndpoint(APPWRITE_PROJECT_URL).setProject(APPWRITE_PROJECT_ID);
    this.account = new Account(appwrite_client);
  }

  async signup({ username, email, password }: SignupParams) {
    try {
        console.log("password",password)
      const user = await this.account.create(ID.unique(), email,password,username);

      if (user) {
        return await this.login({ email, password });
      }
      return user;
    } catch (error: any) {
      console.error("Error in signup:", error.message || error);
      throw error; // Throwing the error so it can be handled by the caller
    }
  }

  async login({ email, password }: LoginParams) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);
      console.log("Session created:", session);
      return session;
    } catch (error: any) {
      console.error("Error in login:", error.message || error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.account.deleteSession("current");
      console.log("Session deleted:", response);
      return response;
    } catch (error: any) {
      console.error("Error in logout:", error.message || error);
      throw error;
    }
  }

  async getUser() {
    try {
      const user = await this.account.get();
      console.log("User fetched:", user);
      return user;
    } catch (error: any) {
      console.error("Error in getUser:", error.message || error);

      // Check for unauthorized access (no active session)
      if (error.code === 401) {
        console.log("No active session, user not logged in.");
        return null;
      }
      throw error; // Re-throw other errors
    }
  }

  async UpdatePref(token:string){
    try {
      const updateResult = await this.account.updatePrefs({"token":token});
      return updateResult;
    } catch (error) {
      console.log(error)
      return null
    }

  }
  async SelectTarget(targetId: string, token: string) {
    try {
      const updateResult = await this.account.updatePushTarget(targetId, token);
      await this.UpdatePref(token)
      return updateResult;
    } catch (updateError: any) {
      try {
        const createResult = await this.account.createPushTarget(
          ID.unique(),
          token,
          'fcm'
        );
        return createResult;
      } catch (createError: any) {
        throw createError;
      }
    }
  }
  
  
}

export default Service;