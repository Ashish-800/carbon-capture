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

const projects = [];

const credits = [];


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
    if (projects.length > 0) {
      const projectBatch = writeBatch(db);
      projects.forEach((project) => {
        const docRef = db.collection('projects').doc(project.id);
        projectBatch.set(docRef, project);
      });
      await projectBatch.commit();
      console.log("Projects seeded successfully.");
    }

    // Seed credits
    console.log(`Seeding ${credits.length} credits...`);
    if (credits.length > 0) {
      const creditBatch = writeBatch(db);
      credits.forEach((credit) => {
        const docRef = db.collection('credits').doc(credit.id);
        creditBatch.set(docRef, credit);
      });
      await creditBatch.commit();
      console.log("Credits seeded successfully.");
    }

    console.log("Database seeded successfully! 🎉");

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
