const ActivityLog = require("./models/ActivityLog ");

async function CreateLog(req, action, newEmail) {
  const user = req.session?.user || { id: null, email: "Guest", role: "guest" };//القيست بتشتغل لما ما  يكون في سيشين وما نرسل ايميل بديل 
  // const user = req.session?.user;
  // const email = user?.email ?? newEmail;
  try {
    await ActivityLog.create({
      email: user.email || newEmail,
      role: req.session.guard,
      action: action,
      route: req.originalUrl,
      method: req.method,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("❌ Log Error:", err.message);
  }
}
module.exports = CreateLog;
