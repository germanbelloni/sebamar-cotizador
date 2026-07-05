const React = require("react");
const ReactDOMServer = require("react-dom/server");

require("./registerReact");

const PrintableBudgetDocument =
  require("./PrintableBudgetDocument.tsx").default;

async function renderPrintableBudget(props) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(PrintableBudgetDocument, props),
  );
}

module.exports = {
  renderPrintableBudget,
};
