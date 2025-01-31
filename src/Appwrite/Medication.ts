import { Client, Databases, ID, Query } from "appwrite";
import Config from "react-native-config";
const getProjectConfig = (): { url: string, projectId: string, databaseId: string, collectionId: string } => {
  const url = Config.APPWRITE_PROJECT_NAME!;
  const projectId = Config.APPWRITE_PROJECT_ID!;
  const databaseId = Config.APPWRITE_DATABASE_ID!;
  const collectionId = Config.APPWRITE_COLLECTION_ID!;

  const missingKeys = [];
  if (!url) missingKeys.push('APPWRITE_PROJECT_URL');
  if (!projectId) missingKeys.push('APPWRITE_PROJECT_ID');
  if (!databaseId) missingKeys.push('APPWRITE_DATABASE_ID');
  if (!collectionId) missingKeys.push('APPWRITE_COLLECTION_ID');

  if (missingKeys.length > 0) {
    throw new Error(`Missing Appwrite project configuration in .env file: ${missingKeys.join(', ')}`);
  }

  return { url, projectId, databaseId, collectionId };
};

const { url: APPWRITE_PROJECT_URL, projectId: APPWRITE_PROJECT_ID, databaseId: APPWRITE_DATABASE_ID, collectionId: APPWRITE_COLLECTION_ID } = getProjectConfig();

export enum WhenToTake {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Bedtime = 'Bedtime',
  BeforeBreakfast = 'Before Breakfast',
  AfterBreakfast = 'After Breakfast',
  BeforeLunch = 'Before Lunch',
  AfterLunch = 'After Lunch',
  BeforeDinner = 'Before Dinner',
  AfterDinner = 'After Dinner',
  WithFood = 'With Food',
  OnEmptyStomach = 'On Empty Stomach',
  AsNeeded = 'As Needed', 
  Custom = 'Custom'
}
export enum MedicationForm {
  Tablet = 'Tablet',
  Syrup = 'Syrup',
  Drops = 'Drops',
  Capsule = 'Capsule',
  Ointment = 'Ointment',
  Cream = 'Cream',
  Injection = 'Injection',
  Patch = 'Patch',
}

export interface Medication {
  $id?: string;
  Name: string;
  DosageForms: MedicationForm; 
  Dose: string;
  WhentoTake: string; 
  DosestartTime: Date;
  DoseEndTime: Date; 
  ReminderTime: Date;
  NeedReminder: boolean;
  Todaystatus?: boolean;
  userId:string|null ,
  ImageUrl:string
}

export class MedicationManager {
  database: Databases;

  constructor() {
    const appwrite_client = new Client().setEndpoint(APPWRITE_PROJECT_URL).setProject(APPWRITE_PROJECT_ID);
    this.database = new Databases(appwrite_client);
  }

  // Add medication
  async addMedication(data: Medication): Promise<any> {
    try {
      const medication = await this.database.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        data
      );
      return { data: medication };
    } catch (error) {
      console.log("Error adding medication:", error);
      return { error: error };
    }
  }

  // Remove medication
  async removeMedication(id: string): Promise<any> {
    try {
      const response = await this.database.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, id);
      return { data: response };
    } catch (error) {
      console.log("Error removing medication:", error);
      return { error: error };
    }
  }

  // Update medication
  async updateMedication(id: string, updatedData: Medication): Promise<any> {
    try {
      const response = await this.database.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        id,
        updatedData
      );
      return { data: response };
    } catch (error) {
      console.log("Error updating medication:", error);
      return { error: error };
    }
  }

  // Get all medications
  async getAllMedications(userId:string): Promise<any> {
    try {
      const medications = await this.database.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        [
          Query.equal('userId', userId)
        ]
      );
      return { data: medications.documents };
    } catch (error) {
      console.log("Error fetching medications:", error);
      return { error: error };
    }
  }

  // Get Date's medications
  async getdateMedications(userId: string, startdate: Date, enddate: Date): Promise<any> {
    try {
      console.log("start date", startdate.toISOString().replace('Z', '+00:00'), "end date", enddate.toISOString().replace('Z', '+00:00')); 
  
      const medications = await this.database.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, [
        Query.equal('userId', userId), // Filter by userId
        Query.greaterThan('DosestartTime', startdate.toISOString().replace('Z', '+00:00')),
        Query.lessThan('DosestartTime', enddate.toISOString().replace('Z', '+00:00'))
      ]);
  
      return medications.documents;
    } catch (error) {
      console.log("Error fetching today's medications:", error);
      return { error: error };
    }
  }
  
  // Toggle medication taken status
  async MedicationTaken(id: string): Promise<any> {
    try {
     
      const response = await this.database.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        id,
        { Todaystatus:true }
      );
      return { data: response };
    } catch (error) {
      console.log("Error toggling medication status:", error);
      return { error: error };
    }
  }
  async getMedicationItem(id: string): Promise<any> {
   try {
   const response=await this.database.getDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, id); 
   return { data: response };
   } catch (error) {
    console.log("Error fetching item:", error);
    return { error: error };
   } 
  }
}
export const MedicationService = new MedicationManager();

