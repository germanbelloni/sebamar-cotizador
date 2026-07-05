const React = require("react");
const ReactDOMServer = require("react-dom/server");

require("./registerReact");

const wrapDocument = require("./template");

const PrintableBudgetDocument = require("./PrintableBudgetDocument.jsx");

async function renderBudget(props) {
  const body = ReactDOMServer.renderToStaticMarkup(
    React.createElement(PrintableBudgetDocument, props),
  );

  return wrapDocument(body);
}

module.exports = {
  renderBudget,
};
