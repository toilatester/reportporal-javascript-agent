const { Log4jsReportPortal, ReportPortalAgent } = require('../../lib');
const { JasmineAgentDebug } = require('../../lib/report-portal/jasmine');
const { ReportPortalAgentDebug } = require('../../lib/report-portal/core');
const { Log4jsConfig } = require('./log4js');
const path = require('path');
const reportConfig = require('./report/reportportal.config.json');
const agent = new ReportPortalAgent(reportConfig);
const log4jsReportPortal = new Log4jsReportPortal(agent);
exports.configure = log4jsReportPortal.configure;
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['../spec-1.js', '../spec-2.js'],
  onPrepare: () => {
    jasmine.getEnv().addReporter(new JasmineAgentDebug(agent));
  },
  beforeLaunch: () => {
    Log4jsConfig(path.join(__dirname, 'protractor.config.debug.js'));
    agent.sendLaunchRequest({}, true);
  },
  afterLaunch: async () => {
    await agent.processAgentRequests();
    const launchFinishObject = await agent.sendLaunchRequest({}, false, true);
    console.log('Check launch finish ', launchFinishObject);
    return launchFinishObject;
  },
};
