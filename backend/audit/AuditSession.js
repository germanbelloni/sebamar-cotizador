const AuditBuilder = require("./AuditBuilder");

class AuditSession {
  constructor(info = {}) {
    this.info = info;
    this.builder = new AuditBuilder();
  }

  add(step) {
    this.builder.add(step);
  }

  getSteps() {
    return this.builder.getSteps();
  }

  getInfo() {
    return this.info;
  }
}

module.exports = AuditSession;
