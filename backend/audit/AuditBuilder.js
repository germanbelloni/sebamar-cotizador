const buildAuditStep = require("./buildAuditStep");

class AuditBuilder {
  constructor() {
    this.steps = [];
  }

  add(data) {
    this.steps.push(buildAuditStep(data));
  }

  getSteps() {
    return this.steps;
  }
}

module.exports = AuditBuilder;
