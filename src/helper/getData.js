const _ = require('lodash');

const getData = ({object, fields}) =>{
    return _.pick(object, fields);
}

const responseUser = (user) => {
    return _.pick(user, ['_id', 'email','phone','isActive','role','first_name','last_name','address']);
}
module.exports = {
    getData,
    responseUser,
};