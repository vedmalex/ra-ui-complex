/// @merge:crc=9fde423e
import gql from 'graphql-tag'
export const schema = gql`
  type Curator {
    id: ID!
    name: String
    userId: ID
    user: User
    courseId: ID
    course: Course
    groupId: ID
    group: Group
  }

  input CuratorCreate {
    id: ID
    user: ID
    course: ID
    group: ID
  }
  input CuratorUpdate {
    id: ID
    user: ID
    course: ID
    group: ID
  }

  type CuratorListResult {
    data: [Curator]
    total: Int
  }
  type CuratorSingleResult {
    data: Curator
  }

  extend type Query {
    getOneCurator(id: ID!): CuratorSingleResult
    getListCurator(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CuratorListResult
    getListNativeCurator(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CuratorListResult
    getManyCurator(ids: [ID]!): CuratorListResult
    getManyReferenceCurator(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CuratorListResult
  }

  extend type Mutation {
    createCurator(data: CuratorCreate!): CuratorSingleResult
    updateCurator(
      id: ID
      data: CuratorUpdate!
      previousData: CuratorUpdate!
    ): CuratorSingleResult
    updateManyCurator(ids: ID!, data: CuratorUpdate!): IdsResult
    deleteCurator(id: ID!, previousData: CuratorUpdate!): CuratorSingleResult
    deleteManyCurator(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createCurator: (_, { data }, { dataProvider }) =>
      dataProvider.create('Curator', { data }),
    updateCurator: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Curator', { id, data, previousData }),
    updateManyCurator: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Curator', { ids, data }),
    deleteCurator: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Curator', { id, previousData }),
    deleteManyCurator: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Curator', { ids }),
  },
  Query: {
    getOneCurator: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Curator', { id }),
    getListCurator: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Curator', { pagination, sort, filter }),
    getListNativeCurator: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Curator', { pagination, sort, filter }),
    getManyCurator: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Curator', { ids }),
    getManyReferenceCurator: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Curator', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Curator: {
    userId: (root) => root.user,
    user: async (root, _, context) =>
      context.resolvers.Query.getOneUser(null, { id: root.user }, context).data,

    courseId: (root) => root.course,
    course: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Course', {
        filter: { id: root.course },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },

    groupId: (root) => root.group,
    group: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Group', {
        filter: { id: root.group },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },

    name: (root, args, context, info) => {
      const { resolvers } = context
      return resolvers.Query.getOneUser(
        null,
        { id: root.user },
        { resolvers },
      ).data.then((data) => data.displayName)
    },
  },
}
