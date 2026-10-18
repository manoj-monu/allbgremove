import fs from 'fs';
import path from 'path';

const specsDir = path.resolve('data/specs');

if (!fs.existsSync(specsDir)) {
  console.error('❌ Error: data/specs directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
  console.error('❌ Error: No spec files found in data/specs!');
  process.exit(1);
}

let hasError = false;
let verifiedCount = 0;
let unverifiedCount = 0;

console.log(`\n🔍 Validating ${files.length} document specifications...\n`);

for (const file of files) {
  const filePath = path.join(specsDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const spec = JSON.parse(raw);

    const requiredFields = [
      'country', 'countryCode', 'countrySlug', 'docType', 'docTypeSlug',
      'widthMm', 'heightMm', 'dpi', 'minPx', 'maxPx', 'maxFileKB',
      'headHeightMinMm', 'headHeightMaxMm', 'eyeLineFromBottomMm',
      'backgroundColor', 'sourceUrl', 'lastVerified', 'verified'
    ];

    for (const field of requiredFields) {
      if (spec[field] === undefined || spec[field] === null || spec[field] === '') {
        console.error(`❌ [${file}] Missing required field: "${field}"`);
        hasError = true;
      }
    }

    // STRICT GOVERNMENT VERIFICATION RULE
    if (spec.verified === true) {
      if (!spec.sourceUrl || !spec.sourceUrl.startsWith('http')) {
        console.error(`❌ [${file}] verified=true but sourceUrl is invalid or missing! Spec must have an official government URL.`);
        hasError = true;
      }
      if (!spec.lastVerified) {
        console.error(`❌ [${file}] verified=true but lastVerified date is missing!`);
        hasError = true;
      }
      if (spec.widthMm <= 0 || spec.heightMm <= 0 || spec.headHeightMinMm <= 0 || spec.headHeightMaxMm <= 0) {
        console.error(`❌ [${file}] verified=true has non-positive millimeter dimensions!`);
        hasError = true;
      }
      verifiedCount++;
    } else {
      unverifiedCount++;
    }

  } catch (err) {
    console.error(`❌ [${file}] JSON Parse Error:`, err.message);
    hasError = true;
  }
}

console.log(`----------------------------------------`);
console.log(`Verified specs:   ${verifiedCount}`);
console.log(`Unverified specs: ${unverifiedCount}`);
console.log(`Total checked:    ${files.length}`);
console.log(`----------------------------------------`);

if (hasError) {
  console.error('\n❌ SPEC VALIDATION FAILED! Please fix the errors listed above before building.\n');
  process.exit(1);
} else {
  console.log('\n✅ All document specifications successfully passed validation!\n');
}
