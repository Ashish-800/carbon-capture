import type { Project, CarbonCredit } from './types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Coastal Mangrove Restoration',
    location: { lat: 10.7905, lng: 76.2144 },
    locationName: 'Kerala, India',
    restorationType: 'Reforestation',
    plantationDate: new Date('2022-06-01'),
    imageUrl: 'https://picsum.photos/seed/mangrove/600/400',
    imageHint: "mangrove forest",
    ndvi: 0.78,
    estimatedCarbonCapture: 15.5,
    creditsAvailable: 5000,
    description: 'This project focuses on restoring mangrove ecosystems along the coastline, which are crucial for biodiversity and carbon sequestration. The restoration helps protect coastal communities from storm surges and provides a habitat for marine life.',
    ngo: { name: 'Coastal Conservation Foundation', logoUrl: '/logos/ngo1.svg' }
  },
  {
    id: 'p2',
    name: 'Amazon Rainforest Reforestation',
    location: { lat: -3.4653, lng: -62.2159 },
    locationName: 'Amazonas, Brazil',
    restorationType: 'Reforestation',
    plantationDate: new Date('2021-08-15'),
    imageUrl: 'https://picsum.photos/seed/amazon/600/400',
    imageHint: "rainforest canopy",
    ndvi: 0.85,
    estimatedCarbonCapture: 22.0,
    creditsAvailable: 12000,
    description: 'A large-scale reforestation effort in a region affected by deforestation. The project involves planting native tree species to restore the natural ecosystem, support local wildlife, and empower indigenous communities through sustainable employment.',
    ngo: { name: 'Amazonas Alive', logoUrl: '/logos/ngo2.svg' }
  },
  {
    id: 'p3',
    name: 'Agroforestry Initiative for Smallholders',
    location: { lat: 8.4862, lng: 39.9922 },
    locationName: 'Oromia, Ethiopia',
    restorationType: 'Agroforestry',
    plantationDate: new Date('2023-01-20'),
    imageUrl: 'https://picsum.photos/seed/agroforestry/600/400',
    imageHint: "coffee plantation",
    ndvi: 0.65,
    estimatedCarbonCapture: 8.2,
    creditsAvailable: 2500,
    description: 'This project integrates trees with crops and/or livestock farming systems. It helps smallholder farmers improve food security, increase income, and enhance land resilience to climate change, all while sequestering carbon.',
    ngo: { name: 'Green Futures Ethiopia', logoUrl: '/logos/ngo3.svg' }
  },
  {
    id: 'p4',
    name: 'Boreal Forest Afforestation Project',
    location: { lat: 55.3781, lng: -3.4360 },
    locationName: 'Ontario, Canada',
    restorationType: 'Afforestation',
    plantationDate: new Date('2020-09-01'),
    imageUrl: 'https://picsum.photos/seed/boreal/600/400',
    imageHint: "boreal forest",
    ndvi: 0.72,
    estimatedCarbonCapture: 12.0,
    creditsAvailable: 8000,
    description: 'Establishing new forests on land that was not previously forested. This project aims to create a new carbon sink, improve biodiversity, and create recreational areas. It focuses on planting native coniferous and deciduous trees.',
    ngo: { name: 'Canada Green Trust', logoUrl: '/logos/ngo4.svg' }
  }
];

export const mockCredits: CarbonCredit[] = [
  {
    id: 'cc1',
    projectId: 'p1',
    projectName: 'Coastal Mangrove Restoration',
    buyer: 'Global Tech Inc.',
    purchaseDate: new Date('2023-11-15'),
    tonnesCO2: 100,
  },
  {
    id: 'cc2',
    projectId: 'p2',
    projectName: 'Amazon Rainforest Reforestation',
    buyer: 'EcoForward Corp.',
    purchaseDate: new Date('2024-01-20'),
    tonnesCO2: 500,
  }
];
