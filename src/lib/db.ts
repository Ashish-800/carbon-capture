import { db } from "@/lib/firebase";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import type { Project } from "@/lib/types";

// A helper function to convert Firestore Timestamps to Dates
const convertTimestampToDate = (data: DocumentData): any => {
  for (const key in data) {
    if (data[key]?.toDate && typeof data[key].toDate === 'function') {
      data[key] = data[key].toDate();
    }
  }
  return data;
};

// A helper function to convert a Firestore document to our Project type
const docToProject = (doc: QueryDocumentSnapshot<DocumentData>): Project => {
  const data = doc.data();
  const convertedData = convertTimestampToDate(data);
  return {
    id: doc.id,
    ...convertedData,
  } as Project;
};


export async function getProjects(): Promise<Project[]> {
  const projectsCol = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCol);
  const projectList = projectSnapshot.docs.map(docToProject);
  return projectList;
}
