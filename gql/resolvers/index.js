const { collection } = require('../../dbConfig/index.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

module.exports = {
  Query: {
    hello: () => 'Fahim Ahammed Firoz',
  },
  Mutation: {
    signup: async (parent, args, context, info) => {
     
        const { name, email, password } = args;
        const alreadyExist = await collection.findOne({ email });
        if (alreadyExist) {
          throw new GraphQLError('Email already exist', {
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED',
            },
          });
        }
        const hashPass = await argon2.hash(password);
        const user = await collection.insertOne({
          name,
          email,
          password: hashPass
        })
        const resultData = { name, email, id: user.insertedId }
        return resultData;
    },
    login: async (parent, args, context, info) => {
     
        const { email, password } = args;
        const user = await collection.findOne({ email });
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED',
            },
          });
        }
        if (!(await argon2.verify(user.password, password))) {
          throw new GraphQLError('Password did not match', {
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED',
            },
          });
        }
        const token = jwt.sign({ data: { userId: user._id, email } }, 'secret', { expiresIn: '1h' })
        return { user, token };
    }
  }
};

