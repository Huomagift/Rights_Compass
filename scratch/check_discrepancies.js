const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/nigeria_constitution_structured.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('--- CONSTITUTION DISCREPANCY AUDIT ---');
console.log('Total sections in JSON:', rawData.sections.length);

let missingTitles = 0;
let missingTexts = 0;
let emptyVerbatim = 0;

rawData.sections.forEach((sec, idx) => {
  if (!sec.section_number) missingTitles++;
  if (!sec.full_text || sec.full_text.trim() === '') emptyVerbatim++;
});

console.log('Missing Section Numbers:', missingTitles);
console.log('Empty Verbatim Texts:', emptyVerbatim);

console.log('\nSample Section Checks:');
[1, 33, 34, 35, 36, 37, 47, 130, 230, 320].forEach((num) => {
  const match = rawData.sections.find((s) => parseInt(s.section_number, 10) === num);
  if (match) {
    console.log(`Section ${num}: "${match.title}" | Text Length: ${match.full_text.length} chars`);
  } else {
    console.log(`WARNING: Section ${num} NOT FOUND in JSON!`);
  }
});
