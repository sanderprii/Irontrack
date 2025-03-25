// This script can be used to run all tests in sequence
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get all test files
const testDir = path.join(__dirname, 'controllers');
const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.test.js'));

console.log(`Found ${testFiles.length} test files to run:`);
testFiles.forEach(file => console.log(`- ${file}`));
console.log('');

// Run tests in sequence
let successCount = 0;
let failureCount = 0;

for (const file of testFiles) {
    const testPath = path.join('src/tests/controllers', file);
    console.log(`\n========================================`);
    console.log(`Running tests in ${file}...`);
    console.log(`========================================\n`);

    try {
        execSync(`npx playwright test ${testPath}`, { stdio: 'inherit' });
        console.log(`\n✅ Tests in ${file} completed successfully`);
        successCount++;
    } catch (error) {
        console.error(`\n❌ Tests in ${file} failed with error:`);
        console.error(error.message);
        failureCount++;
    }
}

console.log(`\n========================================`);
console.log(`Test summary:`);
console.log(`- Total test files: ${testFiles.length}`);
console.log(`- Successful: ${successCount}`);
console.log(`- Failed: ${failureCount}`);
console.log(`========================================`);

if (failureCount > 0) {
    console.log(`\nSome tests failed. Check the logs above for details.`);
    process.exit(1);
} else {
    console.log(`\nAll tests completed successfully!`);
    process.exit(0);
}