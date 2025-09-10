# **App Name**: BlueCarbonChain

## Core Features:

- Role-Based Authentication: Secure login/signup with distinct dashboards for field workers/NGOs and corporate buyers.
- Project Data Upload: Field workers/NGOs can upload project details: location (lat/lon or map pin), restoration type, plantation date, supporting documents (CSV, images).
- Satellite Data Integration: Fetch Sentinel-2 satellite imagery for project location. Display NDVI (vegetation index) calculated from satellite data to show proxy data on vegetative health.
- Carbon Capture Estimation Tool: Estimate carbon capture using satellite-derived NDVI and NCCR guidelines as a tool, providing insights into project effectiveness.
- Carbon Credit Issuance Simulation: Simulate the issuance of carbon credits. A unique credit ID is generated for each verified project. Buyers receive a ‘credit token’ ID linked to the project.
- Project Registry: Browse verified projects with details like location, carbon capture, and available credits. Corporate users can 'purchase' credits, generating a credit token and a downloadable certificate (PDF).
- Map Visualization: Integrate a map (Leaflet/Mapbox) to visualize project locations and overlay satellite-derived NDVI data.

## Style Guidelines:

- Primary color: Dark blue-grey (#2C3E50) for a professional, modern feel.
- Background color: Light grey (#F0F4F8) to provide a clean, neutral backdrop.
- Accent color: Teal (#26A69A) to highlight key elements and CTAs, providing a pop of color and visual interest.
- Headline font: 'Roboto' sans-serif for headlines, ensuring clarity and readability.
- Body font: 'Open Sans' sans-serif for body text, providing a clean and accessible reading experience.
- Use simple, clear icons for navigation and data representation.
- Field worker UI: Simple, mobile-first, designed for offline accessibility in rural areas.
- Buyer UI: Professional, corporate-style dashboard with charts and clear data presentation.
- Subtle transitions and animations for data loading and updates to enhance user experience.