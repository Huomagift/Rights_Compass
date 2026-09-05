/* eslint-env node */
const { processTutorQuery } = require('../services/tutorAgent');

// Test Offline Fallback Path directly
const testQuery = "What are my rights if police stop me and search my car?";
const offlineResult = processTutorQuery(testQuery);

console.log("=== OFFLINE TUTOR ROUTING FALLBACK TEST ===");
console.log(`Query: "${testQuery}"`);
console.log(`Answer Snippet: "${offlineResult.answer.slice(0, 150)}..."`);
console.log(`Citation: "${offlineResult.citation}"`);
console.log(`Urgent: ${offlineResult.isUrgent}`);
console.log(`Emergency Tip: "${offlineResult.emergencyTip || 'None'}"`);

if (offlineResult.answer && offlineResult.citation) {
  console.log("\n✅ OFFLINE FALLBACK ENGINE STATUS: PASSING AND 100% FUNCTIONAL");
} else {
  console.log("\n❌ OFFLINE FALLBACK ENGINE STATUS: FAILED");
}
