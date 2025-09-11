// scripts/seed.ts
import admin from "firebase-admin";
import { collection, getDocs, writeBatch, getFirestore } from "firebase-admin/firestore";

// --- IMPORTANT ---
// 1. Make sure you have created a Firestore database in your Firebase project.
// 2. Download your service account key JSON file from Firebase Project Settings
//    and save it as 'service-account.json' in the root of this project.
//    DO NOT commit this file to your repository.
// 3. Ensure 'service-account.json' is added to your .gitignore file.

import serviceAccount from "../service-account.json";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();

const projects = [
    {
        id: "mangrove_restoration_brazil",
        name: "Coastal Mangrove Restoration",
        location: { lat: -2.53073, lng: -44.3068 },
        locationName: "São Luís, Brazil",
        restorationType: "Reforestation",
        plantationDate: new Date("2022-08-15"),
        imageUrl: "https://picsum.photos/seed/mangrove/600/400",
        imageHint: "mangrove forest",
        ndvi: 0.82,
        estimatedCarbonCapture: 25.5,
        creditsAvailable: 5000,
        description: "This project focuses on restoring degraded mangrove forests along the Brazilian coast, crucial for biodiversity, carbon sequestration, and protecting coastlines from erosion. It involves local communities in planting and monitoring efforts.",
        ngo: {
            id: "ngo_amazonas_alive",
            name: "Amazonas Alive",
            logoUrl: "https://picsum.photos/seed/ngo_logo/32/32"
        },
        status: "Verified",
    },
    {
        id: "amazon_reforestation_initiative",
        name: "Amazon Rainforest Reforestation Initiative",
        location: { lat: -3.4653, lng: -62.2159 },
        locationName: "Amazonas, Brazil",
        restorationType: "Reforestation",
        plantationDate: new Date("2021-11-01"),
        imageUrl: "https://picsum.photos/seed/amazon/600/400",
        imageHint: "rainforest canopy",
        ndvi: 0.88,
        estimatedCarbonCapture: 30.2,
        creditsAvailable: 10000,
        description: "A large-scale initiative to reforest areas of the Amazon affected by deforestation. The project uses native tree species to restore the natural ecosystem, support indigenous communities, and create a vital carbon sink.",
        ngo: {
            id: "ngo_amazonas_alive",
            name: "Amazonas Alive",
            logoUrl: "https://picsum.photos/seed/ngo_logo/32/32"
        },
        status: "Verified",
    },
    {
        id: "agroforestry_colombia",
        name: "Colombian Coffee Agroforestry",
        location: { lat: 4.5709, lng: -74.2973 },
        locationName: "Coffee Triangle, Colombia",
        restorationType: "Agroforestry",
        plantationDate: new Date("2023-03-20"),
        imageUrl: "https://picsum.photos/seed/agroforestry/600/400",
        imageHint: "coffee plantation",
        ndvi: 0.75,
        estimatedCarbonCapture: 15.8,
        creditsAvailable: 3500,
        description: "Integrating shade-grown coffee farming with native tree planting. This agroforestry model improves coffee quality, enhances biodiversity, provides alternative income for farmers, and sequesters carbon in both trees and soil.",
        ngo: {
            id: "ngo_sustainable_harvest",
            name: "Sustainable Harvest Intl.",
            logoUrl: "https://picsum.photos/seed/ngo_logo2/32/32"
        },
        status: "Verified",
    },
];

const credits = [
    {
        id: "BCC-MANGROVE-1A2B3C",
        projectId: "mangrove_restoration_brazil",
        projectName: "Coastal Mangrove Restoration",
        buyer: "Sustainability Lead",
        buyerId: "buyer_global_tech",
        purchaseDate: new Date("2024-05-20"),
        tonnesCO2: 100,
    },
    {
        id: "BCC-AMAZON-4D5E6F",
        projectId: "amazon_reforestation_initiative",
        projectName: "Amazon Rainforest Reforestation Initiative",
        buyer: "Sustainability Lead",
        buyerId: "buyer_global_tech",
        purchaseDate: new Date("2024-06-11"),
        tonnesCO2: 250,
    }
];


async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    const collections = ["projects", "credits"];
    for (const col of collections) {
      const snapshot = await getDocs(collection(db, col));
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`Collection '${col}' cleared.`);
    }
    
    // Seed projects
    console.log(`Seeding ${projects.length} projects...`);
    const projectBatch = writeBatch(db);
    projects.forEach((project) => {
      const docRef = db.collection('projects').doc(project.id);
      projectBatch.set(docRef, project);
    });
    await projectBatch.commit();
    console.log("Projects seeded successfully.");

    // Seed credits
    console.log(`Seeding ${credits.length} credits...`);
    const creditBatch = writeBatch(db);
    credits.forEach((credit) => {
      const docRef = db.collection('credits').doc(credit.id);
      creditBatch.set(docRef, credit);
    });
    await creditBatch.commit();
    console.log("Credits seeded successfully.");

    console.log("Database seeded successfully! 🎉");

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
