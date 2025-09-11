import type { CarbonCredit, Project } from '@/lib/types';

export function generateCertificateHtml(credit: CarbonCredit, project: Project): string {
  const purchaseDate = credit.purchaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Carbon Credit Certificate</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f4f8; color: #2C3E50; }
          .container { max-width: 800px; margin: auto; background: white; border: 4px solid #2C3E50; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .content { padding: 32px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; }
          .header h1 { font-family: 'Roboto', sans-serif; font-size: 24px; color: #2C3E50; margin: 0; }
          .header p { font-size: 14px; color: #64748b; margin: 4px 0 0; }
          .separator { margin-top: 24px; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
          .certify-text { text-align: center; margin-bottom: 24px; }
          .certify-text .intro { font-size: 18px; }
          .certify-text .buyer-name { font-family: 'Roboto', sans-serif; font-size: 30px; font-weight: bold; color: #26A69A; margin: 8px 0; }
          .certify-text .amount { font-family: 'Roboto', sans-serif; font-size: 48px; font-weight: bold; color: #2C3E50; margin: 16px 0; }
          .details { background-color: #f8fafc; border-radius: 6px; padding: 24px; font-size: 14px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .detail-item p { margin: 0; }
          .detail-item .label { color: #64748b; font-weight: 600; margin-bottom: 4px; }
          .detail-item .value { color: #2C3E50; font-weight: 500; }
          .credit-id-item { grid-column: span 2; }
          .credit-id { font-family: monospace; font-size: 12px; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="header">
              <div>
                <h1>Carbon Capture</h1>
                <p>Official Certificate of Carbon Credit Retirement</p>
              </div>
            </div>
            <div class="separator"></div>
            <div class="certify-text">
              <p class="intro">This certifies that</p>
              <h2 class="buyer-name">${credit.buyer}</h2>
              <p class="intro">has retired carbon credits equivalent to</p>
              <p class="amount">${credit.tonnesCO2} tonnes of CO₂</p>
            </div>
            <div class="details">
              <div class="details-grid">
                <div class="detail-item">
                  <p class="label">SUPPORTING PROJECT</p>
                  <p class="value">${credit.projectName}</p>
                </div>
                <div class="detail-item">
                  <p class="label">PROJECT LOCATION</p>
                  <p class="value">${project.locationName}</p>
                </div>
                <div class="detail-item">
                  <p class="label">RETIREMENT DATE</p>
                  <p class="value">${purchaseDate}</p>
                </div>
                <div class="detail-item">
                  <p class="label">IMPLEMENTING PARTNER</p>
                  <p class="value">${project.ngo.name}</p>
                </div>
                <div class="detail-item credit-id-item">
                  <p class="label">UNIQUE CREDIT ID</p>
                  <p class="value credit-id">${credit.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
