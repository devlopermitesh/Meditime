import { Client, Databases, ID, Query } from "appwrite";
import Config from "react-native-config";
interface Report {
    userId: string;      
    ReportDate: string;    
    MeditionId: string;  
    ReportName: string;  
    Taken: boolean;      
  }
  export enum Options{
  Date = 'Date',
  MeditionId='MeditionId',
  ReportName='ReportName',
  Taken='Taken'
  }
  const getProjectConfig = (): { url: string, projectId: string, databaseId: string, collectionId: string } => {
    const url = Config.APPWRITE_PROJECT_NAME!;
    const projectId = Config.APPWRITE_PROJECT_ID!;
    const databaseId = Config.APPWRITE_DATABASE_ID!;
    const collectionId = Config.APPWRITE_REPORT_COLLECTION_ID!;
  
    const missingKeys = [];
    if (!url) missingKeys.push('APPWRITE_PROJECT_URL');
    if (!projectId) missingKeys.push('APPWRITE_PROJECT_ID');
    if (!databaseId) missingKeys.push('APPWRITE_DATABASE_ID');
    if (!collectionId) missingKeys.push('APPWRITE_ REPORT COLLECTION_ID');
  
    if (missingKeys.length > 0) {
      throw new Error(`Missing Appwrite project configuration in .env file: ${missingKeys.join(', ')}`);
    }
  
    return { url, projectId, databaseId, collectionId };
  };
  
  const { url: APPWRITE_PROJECT_URL, projectId: APPWRITE_PROJECT_ID, databaseId: APPWRITE_DATABASE_ID, collectionId: APPWRITE_COLLECTION_ID } = getProjectConfig();
  

  export class ReportManager{
database:Databases;

constructor() {
  const appwrite_client = new Client().setEndpoint(APPWRITE_PROJECT_URL).setProject(APPWRITE_PROJECT_ID);
  this.database = new Databases(appwrite_client);
}
async isDuplicateReport(date: string, meditionId: string): Promise<any> {
    try {
      // Check for existing reports with the same Date and MeditionId
      const Reports = await this.database.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,);
        // [
        //     Query.equal('ReportDate', date),
        //     Query.equal('MeditionId', meditionId)
        //   ]
        const existingReports=Reports.documents.filter(report => report.ReportDate === date && report.MeditionId === meditionId);
      // If there are any existing reports, it's a duplicate
      return existingReports;;
    } catch (error) {
      console.log("Error checking for duplicate report:", error);
      return false;
    }
  }


async addReport(data: Report): Promise<any> {
    try {
         // Convert Date to ISO string for proper comparison
      const date = new Date(data.ReportDate).toISOString()
      

      // Check if a report with the same Date and MeditionId already exists
      const existingReports = await this.isDuplicateReport(date, data.MeditionId);

      if (existingReports.length > 0) {
        await this.updateReport(existingReports.documents[0].$id, data);
        return { data: existingReports.documents[0] };
      }
 
        const report = await this.database.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          ID.unique(),
          data
        )
        return { data: report };   
    } catch (error) {
        console.log("Error adding report:", error);
        return { error: error };
    }
}
async updateReport(id: string, updatedData: Report): Promise<any> {
    try {
        const response = await this.database.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            id,
            updatedData
          );
          return { data: response };
    } catch (error) {
        console.log("Error updating report:", error);
        return { error: error };
    }
}
async getAllReports(userId: string): Promise<any> {
    try {
         const medications = await this.database.listDocuments(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID,
                [
                  Query.equal('userId', userId)
                ]
              );
    } catch (error) {
        console.log("Error fetching reports:", error);
        return { error: error };
    }
}


async getFilteredReports(userId: string, option: string, optionName: Options) {
    try {
      let queries = [Query.equal('userId', userId)];
  
      switch (optionName) {
        case Options.Date:

          const date = new Date(option).toISOString()

          queries.push(Query.equal('ReportDate', date));
          break;
  
        case Options.MeditionId:
          queries.push(Query.equal('MeditionId', option));
          break;
  
        case Options.ReportName:
          queries.push(Query.equal('ReportName', option));
          break;
  
        case Options.Taken:
          const takenValue = option.toLowerCase() === 'true';
          queries.push(Query.equal('Taken', takenValue));
          break;
  
        default:
          throw new Error("Invalid filter option.");
      }
   const response=await this.database.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, queries);
   return { data: response };
    } catch (error) {
      console.log('Error fetching reports:', error);
      return { error: error };
    }
  }
  
  }

  const report=new ReportManager()
  export default report;