
export type Project = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  locationName: string;
  restorationType: 'Afforestation' | 'Reforestation' | 'Agroforestry';
  plantationDate: Date;
  imageUrl: string;
  imageHint: string;
  ndvi: number;
  estimatedCarbonCapture: number; 
  creditsAvailable: number;
  description: string;
  ngo: {
    id: string;
    name: string;
    logoUrl: string;
  };
  status: 'Pending Verification' | 'Verified' | 'Rejected';
};

export type CarbonCredit = {
  id: string;
  projectId: string;
  projectName: string;
  buyer: string; 
  buyerId: string;
  purchaseDate: Date;
  tonnesCO2: number;
};

export type UserProfile = {
  id: string; // Firebase Auth UID
  email: string;
  role: 'ngo' | 'buyer';
  displayName: string;
  address?: string;
  website?: string;
  keyPerson?: string;
  pan?: string;
  phone?: string;

  // NGO specific fields
  ngoType?: 'Trust' | 'Society' | 'Section 8 Company' | 'Other';
  registrationNumber?: string;
  
  // Buyer specific fields
  companyType?: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Other';
  cin?: string;
  incorporationDate?: string;
  gstNumber?: string;
  industry?: string;
  authPersonDesignation?: string;
  authPersonEmail?: string;
  authPersonPhone?: string;
};
