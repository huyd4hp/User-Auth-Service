const _ = require("lodash");
const { EXPOSE_HOST, EXPOSE_PORT, EXPOSE_DOMAIN } = require("../config");

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
  if (EXPOSE_DOMAIN) {
    pickedUser.avatar = `http://${EXPOSE_DOMAIN}/api/v1/avatar/${pickedUser.avatar}`;
  } else {
    pickedUser.avatar = `http://${EXPOSE_HOST}:${EXPOSE_PORT}/api/v1/avatar/${pickedUser.avatar}`;
  }

  return pickedUser;
};
module.exports = {
  getData,
  responseUser,
};
