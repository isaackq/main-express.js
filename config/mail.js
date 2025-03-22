const { auth } = require("./auth");

exports.mail = {
  default: "nodemailer",
  nodemailer: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: JSON.parse(process.env.MAIL_SECURE), //to handle  the boolean object  that come from the env file
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
};
