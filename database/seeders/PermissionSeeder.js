const Premission = require("../models/authorize/Permission")

module.exports = class PermissionSeeder{ 

  static run(){//CRUD
        Premission.create({name: "Create-Task", guard_name: "student"})//الاسم انت حر فيهم
        Premission.create({name: "Read-Task", guard_name: "student"})
        Premission.create({name: "Update-Task", guard_name: "student"})
        Premission.create({name: "Delete-Task", guard_name: "student"})
    }
    
}