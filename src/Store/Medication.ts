import {create} from "zustand"
import { Medication } from "../Appwrite/Medication"

interface IMedicationStore {
    Medication: Medication[];
    CurrentDate:Date;
    setMedication: (medication: Medication[]) => void;
    AddnewMedition: (medication: Medication) => void;
    changeStatus: (medication: Medication) => void;
    updateCurrentDate:(date:Date)=>void;
}

const useMedication=create<IMedicationStore>((set)=>({
    Medication: [],
    CurrentDate:new Date(),
    setMedication: (medication: Medication[]) => set({Medication: medication}),
    AddnewMedition: (medication: Medication) => set((state) => ({Medication: [...state.Medication, medication]})),
    changeStatus: (medication: Medication) => set((state) => ({Medication: state.Medication.map((item) => item.$id === medication.$id ? medication : item)})),
    updateCurrentDate:(date:Date)=>set({CurrentDate:date}),

}))
export default useMedication
