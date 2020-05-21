/// @merge:crc=4c5cdfad
import gql from 'graphql-tag'
export const schema = gql`
  type Group {
    id: ID!
    name: String
    studentsIds: [ID]
    students(pagination: Pagination, filter: JSON): [Student]
    courseId: ID
    course: Course
    curatorId: ID
    curator: Curator
    capitansIds: [ID]
    capitans(pagination: Pagination, filter: JSON): [Capitan]
  }

  input GroupCreate {
    id: ID
    name: String
    course: ID
    curator: ID
  }
  input GroupUpdate {
    id: ID
    name: String
    course: ID
    curator: ID
  }

  type GroupListResult {
    data: [Group]
    total: Int
  }
  type GroupSingleResult {
    data: Group
  }

  extend type Query {
    getOneGroup(id: ID!): GroupSingleResult
    getListGroup(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): GroupListResult
    getListNativeGroup(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): GroupListResult
    getManyGroup(ids: [ID]!): GroupListResult
    getManyReferenceGroup(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): GroupListResult
  }

  extend type Mutation {
    createGroup(data: GroupCreate!): GroupSingleResult
    updateGroup(
      id: ID
      data: GroupUpdate!
      previousData: GroupUpdate!
    ): GroupSingleResult
    updateManyGroup(ids: ID!, data: GroupUpdate!): IdsResult
    deleteGroup(id: ID!, previousData: GroupUpdate!): GroupSingleResult
    deleteManyGroup(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createGroup: (_, { data }, { dataProvider }) =>
      dataProvider.create('Group', { data }),
    updateGroup: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Group', { id, data, previousData }),
    updateManyGroup: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Group', { ids, data }),
    deleteGroup: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Group', { id, previousData }),
    deleteManyGroup: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Group', { ids }),
  },
  Query: {
    getOneGroup: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Group', { id }),
    getListGroup: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Group', { pagination, sort, filter }),
    getListNativeGroup: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Group', { pagination, sort, filter }),
    getManyGroup: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Group', { ids }),
    getManyReferenceGroup: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Group', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Group: {
    studentsIds: async (root, _, { dataProvider }) => {
      let filter = { group: root.id }
      const res = await dataProvider.getListNative('Student', { filter })
      return res.data.map((item) => item.id)
    },
    students: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.group = root.id
      } else {
        filter = { group: root.id }
      }
      const res = await dataProvider.getListNative('Student', {
        pagination,
        filter,
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

    curatorId: (root) => root.curator,
    curator: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Curator', {
        filter: { id: root.curator },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },
    capitansIds: async (root, _, { dataProvider }) => {
      let filter = { group: root.id }
      const res = await dataProvider.getListNative('Capitan', { filter })
      return res.data.map((item) => item.id)
    },
    capitans: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.group = root.id
      } else {
        filter = { group: root.id }
      }
      const res = await dataProvider.getListNative('Capitan', {
        pagination,
        filter,
      })

      return res.data
    },
  },
}
