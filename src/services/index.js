const userDetails = require('./user-details/user-details.service.js');
const users = require('./users/users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(userDetails);
  app.configure(users);
};
