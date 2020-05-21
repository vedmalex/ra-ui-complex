/// @merge:crc=d9124b2d
/// @merge:ignored
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-micro'

import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

// @merge:skip
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import gqlLodash from 'ra-gen-ui-lib/dist/server/lodash'
import { LodashSchema } from 'gql-lodash'
LodashSchema.build()
//
// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin')
import { merge } from 'lodash'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../configure/account.json')

import DataProvider from 'ra-gen-ui-lib/dist/server/dataProviderFirebaseAdmin'
import trackedResources from '../components/students/ui/resources'

import * as Gender from '../graphql/Gender'
import * as Student from '../graphql/Student'
import * as Todo from '../graphql/Todo'
import * as StudentSessions from '../graphql/StudentSessions'
import * as StudentHomeWork from '../graphql/StudentHomeWork'
import * as ContactInformation from '../graphql/ContactInformation'
import * as Course from '../graphql/Course'
import * as Lesson from '../graphql/Lesson'
import * as CoursePackage from '../graphql/CoursePackage'
import * as Capitan from '../graphql/Capitan'
import * as Curator from '../graphql/Curator'
import * as Group from '../graphql/Group'
import * as User from '../graphql/User'
import * as Options from '../graphql/Options'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const dataProvider = new DataProvider({
  trackedResources,
})

const typeDefs = [
  gql`
    scalar JSON
    scalar JSONObject
    scalar ID
    scalar Date

    input Pagination {
      page: Int
      perPage: Int
    }

    enum SortOrder {
      ASC
      DESC
    }

    input Sort {
      field: String!
      order: SortOrder!
    }

    type IdsResult {
      data: [ID]
    }

    type Mutation {
      version: String
    }

    type Query {
      version: String
    }
  `,
  Gender.schema,
  Student.schema,
  Todo.schema,
  StudentSessions.schema,
  StudentHomeWork.schema,
  ContactInformation.schema,
  Course.schema,
  Lesson.schema,
  CoursePackage.schema,
  Capitan.schema,
  Curator.schema,
  Group.schema,
  User.schema,
  Options.schema,
  LodashSchema.schema,
]

const resolvers = merge(
  {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Query: {
      version: () => 'hello',
    },
    Mutation: {
      version: () => 'hello',
    },
  },
  Gender.resolvers,
  Student.resolvers,
  Todo.resolvers,
  StudentSessions.resolvers,
  StudentHomeWork.resolvers,
  ContactInformation.resolvers,
  Course.resolvers,
  Lesson.resolvers,
  CoursePackage.resolvers,
  Capitan.resolvers,
  Curator.resolvers,
  Group.resolvers,
  User.resolvers,
  Options.resolvers,
  LodashSchema.resolvers,
)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

import { adminClient } from './admin'

// adminClient.

const client = ({ resolvers, dataProvider, user }) => {
  // eslint-disable-next-line no-var
  var cl = new ApolloClient({
    cache: new InMemoryCache(),
    // здесь link сделать для lodash
    link: new SchemaLink({
      schema,
      context: () => ({
        client: cl,
        resolvers,
        dataProvider,
        user,
        adminClient: adminClient(user),
      }),
    }),
  })
  return cl
}

// заменить все вызовы resolvers на вызовы запросов к клиенту

const apolloServer = new ApolloServer({
  schema,
  plugins: [gqlLodash({})],
  context: async ({ req }) => {
    const auth = req.headers.authorization
    const token = auth ? auth.match(/Bearer (.*)/)[1] : false
    let user
    if (token) {
      try {
        user = await admin
          .auth()
          .verifyIdToken(token)
          .then((user) => admin.auth().getUser(user.uid))
      } catch (e) {
        throw new AuthenticationError(e.message)
      }
      // } else {
      // throw new AuthenticationError('user not allowed to access');
    }
    return {
      user,
      dataProvider,
      resolvers,
      client: client({ user, dataProvider, resolvers }),
      adminClient: adminClient(user),
    }
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: `/api/students` })
//https://medium.com/@tomanagle/create-a-server-side-rendering-graphql-client-with-next-js-and-apollo-client-acd397f70c64
