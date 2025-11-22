import type { Project, CarbonCredit, UserProfile } from "@/lib/types";

// Mock Data Storage
let projects: Project[] = [
  {
    id: "project-1",
    name: "Sundarbans Mangrove Restoration",
    location: { lat: 21.9497, lng: 89.1833 },
    locationName: "Sundarbans, West Bengal",
    restorationType: "Reforestation",
    plantationDate: new Date("2023-01-15"),
    description: "Restoring the critical mangrove ecosystem in the Sundarbans delta to protect against cyclones and sequester carbon.",
    ngo: {
      id: "ngo_1",
      name: "Green Bengal Foundation",
      logoUrl: "https://picsum.photos/seed/ngo1/50/50"
    },
    status: "Verified",
    imageUrl: "https://picsum.photos/seed/sundarbans/800/600",
    imageHint: "mangrove forest",
    creditsAvailable: 5000,
    ndvi: 0.75,
    estimatedCarbonCapture: 25.5
  },
  {
    id: "project-2",
    name: "Kerala Backwaters Blue Carbon",
    location: { lat: 9.9312, lng: 76.2673 },
    locationName: "Kochi, Kerala",
    restorationType: "Reforestation",
    plantationDate: new Date("2023-03-10"),
    description: "Preserving seagrass beds and mangroves along the Kerala coast to enhance marine biodiversity.",
    ngo: {
      id: "ngo_2",
      name: "Kerala Coastal Trust",
      logoUrl: "https://picsum.photos/seed/ngo2/50/50"
    },
    status: "Pending Verification",
    imageUrl: "https://picsum.photos/seed/kerala/800/600",
    imageHint: "kerala backwaters",
    creditsAvailable: 0,
    ndvi: 0.68,
    estimatedCarbonCapture: 18.2
  }
];

let users: UserProfile[] = [];
let credits: CarbonCredit[] = [];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function addUserProfile(userId: string, data: Omit<UserProfile, 'id'>) {
  await delay(500);
  const newUser: UserProfile = { id: userId, ...data };
  const existingIndex = users.findIndex(u => u.id === userId);
  if (existingIndex >= 0) {
    users[existingIndex] = newUser;
  } else {
    users.push(newUser);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  await delay(300);
  return users.find(u => u.id === userId) || null;
}

export async function addProject(projectData: Omit<Project, 'id'>): Promise<Project> {
  await delay(500);
  const newProject: Project = {
    id: `project-${Date.now()}`,
    ...projectData
  };
  projects.push(newProject);
  return newProject;
}

export async function getProjects(): Promise<Project[]> {
  await delay(300);
  return [...projects];
}

export async function getProjectById(id: string): Promise<Project | null> {
  await delay(300);
  return projects.find(p => p.id === id) || null;
}

export async function getCreditsByBuyer(buyerId: string): Promise<CarbonCredit[]> {
  await delay(300);
  return credits.filter(c => c.buyerId === buyerId);
}

export async function getProjectsByNgo(ngoId: string): Promise<Project[]> {
  await delay(300);
  return projects.filter(p => p.ngo.id === ngoId);
}
