require("dotenv").config(); //لازم تتعرف //because the .env is not loaded and we did not run the app.js to load the enviroment variables//لازم ملف البروسيس يشتغل لما نعمل رن للسيرفر
const Admin = require("../../models/Admin");
console.log("Admin Seeder");
module.exports = class AdminSeeder {
  //لما نعمل زي هيك بنكون صدرنا الكلاس للخارج من دون ميكون جوا الملف لانو تصدر مباشرة ازا بدنا نستدعي الكلاس من اسمو جوا الملف بنخلي الموديول اكسبورت تحت
  static run() {
    Admin.create({
      firstName: "Super",
      lastName: "Isaac",
      email: "isaac@email.com",
      gender: "M",
      password: "$2b$10$g/NTZprqc/4iomIW59PQdePYzomT1dDpTNW5VYOByOZRBo9xDT/j6",
      blocked: false,
    });
  }
};

// // ✅ This runs the seeder when the file is called directly from terminal
// if (require.main === module) {
//   module.exports.run();
// }

module.exports.run();
// module.exports = AdminSeeder;
// AdminSeeder.run();
