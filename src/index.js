const fs = require('fs');
const { render } = require('mustache');

const template = `# Jest Test Results

| Tests  |   # |    % |
| ------ | --: | ---: |
| Passed | {{numPassedTests}} | {{percentPassedTests}}% |
| Failed | {{numFailedTests}} | {{percentFailedTests}}% |
| Total  | {{numTotalTests}} | 100% |`;

class DocumentTestHooksReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  toPercent(n) {
    return Math.round(n * 100);
  }

  onRunComplete(test, runResults) {
    const numFailedTests = arguments['1'].numFailedTests;
    const numPassedTests = arguments['1'].numPassedTests;
    const numTotalTests = numFailedTests + numPassedTests;
    const percentFailedTests = this.toPercent(numFailedTests / numTotalTests);
    const percentPassedTests = this.toPercent(numPassedTests / numTotalTests);

    const results = {
      numFailedTests,
      numPassedTests,
      numTotalTests,
      percentFailedTests,
      percentPassedTests,
    };

    const output = render(template, results);
    fs.writeFileSync('./JEST_RESULTS.md', output);
  }
}

module.exports = DocumentTestHooksReporter;
