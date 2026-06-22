"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBlockedAttempt = saveBlockedAttempt;
/**
 * Saves a blocked scraping attempt to Parcel Memory for auditability and analytics.
 */
async function saveBlockedAttempt(record) {
    const fullRecord = {
        ...record,
        status: "blocked",
        timestamp: new Date().toISOString()
    };
    const namespace = "website-cloner/scrape-attempts";
    // Hackathon integration of Parcel Memory
    console.error(`[Parcel] Saving record to namespace: ${namespace}`);
    console.error(`[Parcel] Payload:`, JSON.stringify(fullRecord, null, 2));
    // Placeholder for real REST API call to Parcel backend
    const parcelApiUrl = process.env.PARCEL_API_URL;
    if (parcelApiUrl) {
        const response = await fetch(`${parcelApiUrl}/api/v1/memory/${encodeURIComponent(namespace)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fullRecord)
        });
        if (!response.ok) {
            throw new Error(`Parcel API responded with status: ${response.status}`);
        }
    }
    else {
        // For demo purposes, we resolve immediately if no real API URL is configured.
        // console.error("[Parcel] PARCEL_API_URL not set, simulating successful save.");
    }
}
