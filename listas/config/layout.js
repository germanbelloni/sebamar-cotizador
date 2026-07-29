"use strict";

module.exports = {
  pageSetup: {
    paperSize: 9, // A4
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    horizontalCentered: true,
    verticalCentered: false,
    margins: {
      left: 0.28,
      right: 0.28,
      top: 0.2,
      bottom: 0.25,
      header: 0.1,
      footer: 0.1,
    },
  },
  columns: [
    { width: 14 },
    { width: 16 },
    { width: 18 },
    { width: 16 },
    { width: 16 },
  ],
  showGridLines: false,
};
