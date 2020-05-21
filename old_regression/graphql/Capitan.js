/// @merge:crc=22f1ac55
import gql from 'graphql-tag'
export const schema = gql`
  type Capitan {
    id: ID!
    name: String
    userId: ID
    user: User
    groupId: ID
    group: Group
    courseId: ID
    course: Course
  }

  input CapitanCreate {
    id: ID
    user: ID
    group: ID
    course: ID
  }
  input CapitanUpdate {
    id: ID
    user: ID
    group: ID
    course: ID
  }

  type CapitanListResult {
    data: [Capitan]
    total: Int
  }
  type CapitanSingleResult {
    data: Capitan
  }

  extend type Query {
    getOneCapitan(id: ID!): CapitanSingleResult
    getListCapitan(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CapitanListResult
    getListNativeCapitan(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CapitanListResult
    getManyCapitan(ids: [ID]!): CapitanListResult
    getManyReferenceCapitan(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CapitanListResult
  }

  extend type Mutation {
    createCapitan(data: CapitanCreate!): CapitanSingleResult
    updateCapitan(
      id: ID
      data: CapitanUpdate!
      previousData: CapitanUpdate!
    ): CapitanSingleResult
    updateManyCapitan(ids: ID!, data: CapitanUpdate!): IdsResult
    deleteCapitan(id: ID!, previousData: CapitanUpdate!): CapitanSingleResult
    deleteManyCapitan(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createCapitan: (_, { data }, { dataProvider }) =>
      dataProvider.create('Capitan', { data }),
    updateCapitan: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Capitan', { id, data, previousData }),
    updateManyCapitan: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Capitan', { ids, data }),
    deleteCapitan: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Capitan', { id, previousData }),
    deleteManyCapitan: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Capitan', { ids }),
  },
  Query: {
    getOneCapitan: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Capitan', { id }),
    getListCapitan: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Capitan', { pagination, sort, filter }),
    getListNativeCapitan: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Capitan', { pagination, sort, filter }),
    getManyCapitan: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Capitan', { ids }),
    getManyReferenceCapitan: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Capitan', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Capitan: {
    userId: (root) => root.user,
    user: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('User', {
        filter: { id: root.user },
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

    courseId: (root) => root.course,
    course: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Course', {
        filter: { id: root.course },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },

    name: (root, args, context, info) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
  },
}
