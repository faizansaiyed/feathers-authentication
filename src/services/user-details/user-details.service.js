// Initializes the `user-details` service on path `/user-details`
const createService = require('feathers-rethinkdb');
const hooks = require('./user-details.hooks');

module.exports = function (app) {
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'user_details',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user-details', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('user-details');

  service.hooks(hooks);
};
