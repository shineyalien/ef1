# FBR Retry Mechanism Test Suite

This directory contains a comprehensive test suite for the FBR (Federal Board of Revenue) retry mechanism implemented in the Easy Filer v3 application.

## Overview

The test suite is designed to validate the retry mechanism under various failure scenarios and identify potential issues that could impact reliability and performance. It includes:

1. **Retry Service Tests** (`test-retry-service.js`) - Tests the core retry functionality
2. **Cron Job Tests** (`test-cron-job.js`) - Tests the background job processing
3. **Integration Tests** (`test-fbr-integration-retry.js`) - Tests the end-to-end integration with the FBR client

## Prerequisites

Before running the tests, ensure you have:

- Node.js installed (version 16 or higher)
- Jest testing framework installed (`npm install --save-dev jest`)
- Access to the project source code

## Running the Tests

### Option 1: Run All Tests

Use the test runner to execute all test files:

```bash
node run-retry-tests.js
```

This will run all test files and provide a summary of the results.

### Option 2: Run Individual Test Files

Run specific test files directly:

```bash
# Test the retry service
node test-retry-service.js

# Test the cron job
node test-cron-job.js

# Test the integration with FBR client
node test-fbr-integration-retry.js
```

## Test Coverage

### Retry Service Tests (`test-retry-service.js`)

- **Exponential Backoff Calculation**: Validates the retry delay calculation
- **Invoice Eligibility**: Checks if invoices are correctly identified as eligible for retry
- **Get Invoices Ready for Retry**: Tests the database query for pending retries
- **Manual Retry Functions**: Tests manual retry control functions
- **Error Handling**: Validates error handling in various scenarios

### Cron Job Tests (`test-cron-job.js`)

- **Successful Execution**: Tests normal cron job operation
- **Unauthorized Access**: Validates authentication mechanisms
- **Error Handling**: Tests error handling in retry processing
- **Method Support**: Verifies both GET and POST method support
- **Custom Configuration**: Tests custom cron secret configuration

### Integration Tests (`test-fbr-integration-retry.js`)

- **Successful Submission**: Tests successful FBR submission with retry
- **Validation Errors**: Tests handling of FBR validation errors
- **Network Errors**: Tests handling of network errors
- **Max Retry Limit**: Tests enforcement of maximum retry limits
- **QR Code Generation**: Tests QR code generation after successful retry

## Understanding the Results

Each test file provides detailed output showing:

- ✅ Passed tests
- ❌ Failed tests with error messages
- ⚠️ Tests that require proper mocking framework

After running all tests, you'll get a summary showing:
- Number of test suites passed
- Number of test suites failed
- Recommendations for next steps

## Identified Issues

The test suite identifies several potential issues in the retry mechanism:

### High Priority Issues

1. **Race Condition Risk**: Multiple concurrent retry attempts for the same invoice
2. **Error Categorization**: All errors are treated as retriable, including permanent errors
3. **Database Performance**: No indexes on retry-related fields

### Medium Priority Issues

1. **Security**: Weak default cron secret
2. **Monitoring**: No metrics collection or alerting
3. **Token Management**: No token refresh mechanism

### Low Priority Issues

1. **Scalability**: Fixed batch size and no prioritization
2. **Idempotency**: No protection against duplicate submissions
3. **Retry History**: No tracking of retry patterns over time

## Recommendations

Based on the test results and analysis, we recommend:

1. **Implement Error Categorization**: Distinguish between transient and permanent errors
2. **Add Database Locking**: Prevent concurrent retry attempts
3. **Implement Monitoring**: Add metrics collection and alerting
4. **Enhance Security**: Use strong authentication secrets
5. **Add Database Indexes**: Improve query performance for retry processing

## Detailed Analysis

For a comprehensive analysis of the retry mechanism, including detailed explanations of all identified issues and recommendations, refer to the [`RETRY_MECHANISM_ANALYSIS_REPORT.md`](RETRY_MECHANISM_ANALYSIS_REPORT.md) file.

## Troubleshooting

### Tests Fail to Run

If tests fail to run, check:

1. All test files are present in the directory
2. Jest is properly installed
3. Source files are accessible

### Mocking Framework Errors

Some tests show ⚠️ warnings about requiring a proper mocking framework. These tests would provide more accurate results with:

```bash
npm install --save-dev jest
```

### TypeScript Errors

If you encounter TypeScript errors, ensure:

1. All TypeScript dependencies are installed
2. The project is properly configured
3. All imports are correctly resolved

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Include both positive and negative test cases
3. Add clear descriptions of what each test validates
4. Update this README file with new test information

## Running Tests in CI/CD

To integrate these tests into a CI/CD pipeline:

1. Ensure all dependencies are installed
2. Run the test suite using the test runner
3. Fail the build if any tests fail
4. Capture test results and reports

Example CI/CD script:

```bash
# Install dependencies
npm install

# Run retry mechanism tests
node run-retry-tests.js

# Check exit code
if [ $? -ne 0 ]; then
  echo "Retry mechanism tests failed"
  exit 1
fi
```

## Additional Resources

- [FBR Integration Documentation](./FBR_INTEGRATION_ISSUES_REPORT.md)
- [FBR Debugging Summary](./FBR_DEBUGGING_SUMMARY.md)
- [Retry Mechanism Analysis Report](./RETRY_MECHANISM_ANALYSIS_REPORT.md)