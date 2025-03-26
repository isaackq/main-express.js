const { DataTypes } = require("sequelize");
const connection = require("../../../config/database");
/**
 *id , name , signature ,client_id , user_id , revoked , expires_at , created/updated_at
 *1 :: user1 :: abcdef1 :: 1 :: 1 :: false ::123123123 , -----------
 *2 :: user1 :: abcdef2 :: 1 :: 2 :: false ::123123123 , -----------//قيم السيقناتشر قيم مشفرة من فيم التوكن
 *3 :: user1 :: abcdef3 :: 1 :: 2 :: false ::123123123 , -----------//user2 has 2  tokens on the same client id 2
 *
 */

const AccessToken = connection.define("access_token", {
  //بعمل الجمع لحالو
  //الجدول المخصص لعملية احتواء عمليات الريسيت توكن على مستوى القارد الي شغال عليه
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  signature: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  client_id: {
    type: DataTypes.BIGINT({ unsigned: true }),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT({ unsigned: true }),
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.BIGINT, //date include date and time  , date only include only date without time
    allowNull: false,
  },
});

module.exports = AccessToken;
