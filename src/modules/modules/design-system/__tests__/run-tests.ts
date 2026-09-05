/**
 * AWS SBG Design System - Automated CLI Test Runner
 * 
 * Executable via: `npm test` or `npx tsx src/modules/design-system/__tests__/run-tests.ts`
 */

import { designSystemTestCases } from './test-definitions';

function runSuite() {
  console.log('===============================================================');
  console.log('  AWS STUDENT BUILDER GROUP - MEMBER 01 TEST SUITE');
  console.log('  Testing UI Primitives, Accessibility, Motion & Design Tokens');
  console.log('===============================================================\n');

  let passedCount = 0;
  let failedCount = 0;
  const startTime = Date.now();

  for (const testCase of designSystemTestCases) {
    try {
      const result = testCase.execute();
      if (result.passed) {
        passedCount++;
        console.log(`  [PASS] [${testCase.category}] ${testCase.name}`);
        console.log(`         -> ${result.message}`);
      } else {
        failedCount++;
        console.error(`  [FAIL] [${testCase.category}] ${testCase.name}`);
        console.error(`         -> ${result.message}`);
      }
    } catch (err: unknown) {
      failedCount++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`  [ERROR] [${testCase.category}] ${testCase.name}`);
      console.error(`          -> Exception: ${errorMessage}`);
    }
  }

  const duration = Date.now() - startTime;
  console.log('\n---------------------------------------------------------------');
  console.log(`  Total: ${designSystemTestCases.length} | Passed: ${passedCount} | Failed: ${failedCount} (${duration}ms)`);
  console.log('---------------------------------------------------------------');

  if (failedCount > 0) {
    console.error('\n❌ Test suite failed. Please resolve the errors above.');
    process.exit(1);
  } else {
    console.log('\n All Member 01 UI primitives & tokens passed verification!\n');
  }
}

runSuite();
