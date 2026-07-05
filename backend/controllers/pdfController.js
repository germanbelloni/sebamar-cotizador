const { renderBudget } = require("../pdf/render/renderBudget");
async function preview(req, res) {
  console.log("========== PDF V2 ==========");
  console.log(JSON.stringify(req.body, null, 2));

  const html = await renderBudget(req.body);

  return res.send(html);
}

module.exports = {
  preview,
};
