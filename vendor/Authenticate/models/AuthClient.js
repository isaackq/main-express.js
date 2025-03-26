const { DataTypes } = require("sequelize");
const connection = require("../../../config/database");
/**
 * id , name ,secret , provider , revoked , created/updated_at
 *-------------------
 * 1 :: user-client     :: sdrftqesr :: users    :: false :: -----
 * 1 :: student-client  :: sdrftqesr :: students :: false :: -----
 */

const AuthClient = connection.define("auth_client", {
  //بعمل الجمع لحالو
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  secret: {
    type: DataTypes.STRING(100),
    unique: true, //imortant
    allowNull: false,
  },
  provider: {
    //بنفعش يكون يونيك لانو ممكن  يكون نفس البروفايدر والو اكتر من سيكريت // revoked secret or not
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = AuthClient;
