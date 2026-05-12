const User = require("../../models/User");

async function resolvePricingUser(user) {
  // 👑 SUPERADMIN
  if (user.role === "superadmin") {
    return user;
  }

  // 👨 USER
  // usa pricing del owner
  if (user.role === "user" && user.ownerId) {
    const owner = await User.findById(user.ownerId).lean();

    if (owner) {
      return owner;
    }
  }

  // 🧑 ADMIN
  return user;
}

module.exports = resolvePricingUser;
