import { Client, Databases, Query } from "appwrite";
import Config from "react-native-config";

const APPWRITE_PROJECT_URL: string = Config.APPWRITE_PROJECT_URL!;
const APPWRITE_PROJECT_ID: string = Config.APPWRITE_PROJECT_ID!;
const APPWRITE_DATABASE_ID: string = Config.APPWRITE_DATABASE_ID!;
const APPWRITE_COLLECTION_ID: string = Config.APPWRITE_COLLECTION_ID!;

enum WhenToTake {
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

enum MedicationForm {
  Tablet = 'Tablet',
  Syrup = 'Syrup',
  Drops = 'Drops',
  Capsule = 'Capsule',
  Ointment = 'Ointment',
  Cream = 'Cream',
  Injection = 'Injection',
  Patch = 'Patch',
}

interface Medication {
  id: string;
  Name: string;
  DosageForms: MedicationForm;
  Dose: string;
  WhentoTake: WhenToTake;
  DoseStartTime: Date;
  DoseEndTime: Date;
  ReminderTime: Date;
  Taken: boolean;
}

class MedicationManager {
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
        data.id,
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
  async getAllMedications(): Promise<any> {
    try {
      const medications = await this.database.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID);
      return { data: medications.documents };
    } catch (error) {
      console.log("Error fetching medications:", error);
      return { error: error };
    }
  }

  // Get today's medications
  async getTodayMedications(): Promise<any> {
    try {
      const today = new Date();
      const medications = await this.database.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, [
        Query.equal('DoseStartTime', today.toISOString()), // Filter based on today's date (example)
      ]);
      return { data: medications.documents };
    } catch (error) {
      console.log("Error fetching today's medications:", error);
      return { error: error };
    }
  }

  // Toggle medication taken status
  async toggleMedicationTakenStatus(id: string, currentStatus: boolean): Promise<any> {
    try {
      const updatedMedication = {
        Taken: !currentStatus, // Toggle the status (true becomes false and vice versa)
      };
      const response = await this.database.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        id,
        updatedMedication
      );
      return { data: response };
    } catch (error) {
      console.log("Error toggling medication status:", error);
      return { error: error };
    }
  }
}

export default new MedicationManager();
