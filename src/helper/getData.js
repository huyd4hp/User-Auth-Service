const _ = require("lodash");
const { APP_HOST } = require("../config");

const getData = ({ object, fields }) => {
  return _.pick(object, fields);
};

const responseUser = (user) => {
  // Sử dụng _.pick để lấy các thuộc tính cần thiết
  let pickedUser = _.pick(user, [
    "_id",
    "avatar",
    "email",
    "phone",
    "isActive",
    "role",
    "first_name",
    "last_name",
    "address",
  ]);
  pickedUser.avatar = `https://${APP_HOST}/api/v1/avatar/${pickedUser.avatar}`;

  return pickedUser;
};
module.exports = {
  getData,
  responseUser,
};
