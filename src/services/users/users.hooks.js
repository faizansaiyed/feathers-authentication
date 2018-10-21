const errors = require('@feathersjs/errors');
const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      hashPassword(), 
      async context => {
        let input = context.data
        await context.service.find({
          query: {
            email: input.email
          }
        }).then((data) => {
          if (data.data.length) {
            throw new errors.Conflict('Conflict', {
              errors: { message: 'This email is already registered.' }
            })
          }
        })
      }
    ],
    update: [ hashPassword(),  authenticate('jwt') ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      hook => after_user_create(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function after_user_create (hook) {
  if (hook.data.id) {
    hook.app.service('user-details').create(hook.data)
    .then((res)=>{
    }).catch((err)=>{
      throw new errors.BadRequest('Error', {
        errors: { message: err }
      })
    })
  }
}
