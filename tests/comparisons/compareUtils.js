function nearlyEqual(a, b, tolerance = 0.01) {
  return Math.abs(a - b) <= tolerance;
}

function diffNumber(a, b) {
  return (a - b).toFixed(2);
}

module.exports = {
  nearlyEqual,
  diffNumber,
};
