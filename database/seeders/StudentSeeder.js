const Student = require("../../models/students");

module.exports = class StudentSeeder {
  static run() {
    Student.create({
      firstName: "isaac",
      lastName: "kamel",
      email: "isaac@app.com",
      gender: "M",
      password: "hdksfgsdkfjgdofjgosdfgosdfg",
      blocked: false,
    });
  }
};
