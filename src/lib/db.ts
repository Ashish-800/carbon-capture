import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { Project, CarbonCredit } from "@/lib/types";

// A helper function to convert Firestore Timestamps to Dates
const convertTimestampToDate = (data: DocumentData): any => {
  if (!data) return data;
  for (const key in data) {
    if (data[key]?.toDate && typeof data[key].toDate === "function") {
      data[key] = data[key].toDate();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      // Recursively convert nested objects
      convertTimestampToDate(data[key]);
    }
  }
  return data;
};

// A helper function to convert a Firestore document to our Project type
const docToProject = (
  doc: QueryDocumentSnapshot<DocumentData> | DocumentData
): Project => {
  const data = doc.data();
  const convertedData = convertTimestampToDate(data);
  return {
    id: doc.id,
    ...convertedData,
  } as Project;
};

const docToCredit = (
  doc: QueryDocumentSnapshot<DocumentData> | DocumentData
): CarbonCredit => {
  const data = doc.data();
  const convertedData = convertTimestampToDate(data);
  return {
    id: doc.id,
    ...convertedData,
  } as CarbonCredit;
};


export async function getProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, "projects");
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(docToProject);
    return projectList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projectDocRef = doc(db, "projects", id);
    const projectDoc = await getDoc(projectDocRef);
    if (projectDoc.exists()) {
      return docToProject(projectDoc);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

export async function getCreditsByBuyer(buyerId: string): Promise<CarbonCredit[]> {
    try {
        const creditsCol = collection(db, "credits");
        const q = query(creditsCol, where("buyerId", "==", buyerId));
        const creditSnapshot = await getDocs(q);
        const creditList = creditSnapshot.docs.map(docToCredit);
        return creditList;
    } catch (error) {
        console.error(`Error fetching credits for buyer ${buyerId}:`, error);
        return [];
    }
}

export async function getProjectsByNgo(ngoId: string): Promise<Project[]> {
    try {
        const projectsCol = collection(db, "projects");
        const q = query(projectsCol, where("ngo.id", "==", ngoId));
        const projectSnapshot = await getDocs(q);
        const projectList = projectSnapshot.docs.map(docToProject);
        return projectList;
    } catch (error) {
        console.error(`Error fetching projects for NGO ${ngoId}:`, error);
        return [];
    }
}
