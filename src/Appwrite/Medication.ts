import { Client, Databases, ID, Query } from "appwrite";
import Config from "react-native-config";
import report, { Options } from "./Report";
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
  async setCurrentTaken(setupDate: Date, data: any[]): Promise<any[]> {
    try {
      // Normalize date to start of the day
      const newdate = new Date(setupDate);
      newdate.setHours(0, 0, 0, 0);
      
      const localDateString = newdate.toISOString().split("T")[0]; // "2025-02-10"


      if (!data.length) return [];
  
      // Fetch reports for the first user's first medication
      const { userId, $id } = data[0];
      const reportDate = await report.getFilteredReports(userId,localDateString,Options.Date);
  
  
      // Check if reports exist
      const documents = reportDate?.data?.documents ?? [];
      console.log("document is lentgh",data)
      if (!documents.length) return data;
  
      // Create a lookup map for MeditionId -> Taken status
      const reportMap = new Map(documents.map((doc: any) => [doc.MeditionId, doc.Taken]));
  
      // Process medications
      const medicationPromises = data.map(async (medication: Medication) => {
        try {
          const takenStatus = reportMap.get(medication.$id);
          if (takenStatus !== undefined) {
            medication.Todaystatus = takenStatus;
  
  
            const updatedData = {
              userId: medication.userId,
              Name: medication.Name,
              ImageUrl: medication.ImageUrl,
              DosageForms: medication.DosageForms,
              Dose: medication.Dose,
              WhentoTake: medication.WhentoTake,
              DosestartTime: medication.DosestartTime,
              DoseEndTime: medication.DoseEndTime,
              ReminderTime: medication.ReminderTime,
              NeedReminder: medication.NeedReminder,
              Todaystatus: medication.Todaystatus
            };
  
            await this.updateMedication(medication.$id as string, updatedData);
            return medication;
          }
        } catch (error) {
          console.error("Error updating medication:", error);
          return null; // In case of error, return null to filter later
        }
      });
  
      // Await all promises and filter out failed updates
      const updatedMedications = (await Promise.all(medicationPromises)).filter(Boolean);
  
      console.log("Updated Medications:", updatedMedications);
      return updatedMedications;
    } catch (error) {
      console.error("Error in setCurrentTaken:", error);
      return [];
    }
  }
  
  // Get Medications for Specific Date Range
  async getdateMedications(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const start = startDate.getTime();
      const end = endDate.getTime();
  
      const { documents } = await this.database.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        [Query.equal('userId', userId)],

      );
  
      // Filter medications
      const filteredMedications = documents.filter((medication) => {
        const doseEndTime = new Date(medication.DoseEndTime).getTime();
        const doseStartTime = new Date(medication.DosestartTime).getTime();
        return doseEndTime >= end && doseStartTime <= start;
      });
  
      // Fetch current taken status
      const updatedMedications = await this.setCurrentTaken(startDate, filteredMedications);
  
      console.log(`Current date: ${new Date().toISOString()}, Medications Status:`, updatedMedications);
  
      return updatedMedications.length ? updatedMedications : [];
    } catch (error) {
      console.error("Error fetching medications:", error);
      return [];
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

