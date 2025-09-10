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
    name: string;
    logoUrl: string;
  };
};

export type CarbonCredit = {
  id: string;
  projectId: string;
  projectName: string;
  buyer: string; 
  purchaseDate: Date;
  tonnesCO2: number;
};
