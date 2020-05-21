/// @merge:crc=908da786
import gql from 'graphql-tag'
export const schema = gql`
  # custom type implementation

  type User {
    id: ID!
    uid: String
    displayName: String
    disabled: Boolean
    email: String
    phoneNumber: String
    photoURL: String
    password: String
    emailVerified: Boolean
    options: Options
    coursesIds: [ID]
    courses(pagination: Pagination, filter: JSON): [Course]
    groupsIds: [ID]
    groups(pagination: Pagination, filter: JSON): [Group]
    packagesIds: [ID]
    packages(pagination: Pagination, filter: JSON): [CoursePackage]
    curatorIds: [ID]
    curator(pagination: Pagination, filter: JSON): [Curator]
    capitanIds: [ID]
    capitan(pagination: Pagination, filter: JSON): [Capitan]
    studentIds: [ID]
    student(pagination: Pagination, filter: JSON): [Student]
  }

  input UserCreate {
    uid: String
    displayName: String
    disabled: Boolean
    email: String
    phoneNumber: String
    photoURL: String
    password: String
    emailVerified: Boolean
    options: OptionsCreate
  }
  input UserUpdate {
    uid: String
    displayName: String
    disabled: Boolean
    email: String
    phoneNumber: String
    photoURL: String
    password: String
    emailVerified: Boolean
    options: OptionsUpdate
  }

  type UserListResult {
    data: [User]
    total: Int
  }
  type UserSingleResult {
    data: User
  }

  extend type Query {
    getOneUser(id: ID!): UserSingleResult
    getListUser(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): UserListResult
    getListNativeUser(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): UserListResult
    getManyUser(ids: [ID]!): UserListResult
    getManyReferenceUser(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): UserListResult
  }

  extend type Mutation {
    createUser(data: UserCreate!): UserSingleResult
    updateUser(
      id: ID
      data: UserUpdate!
      previousData: UserUpdate!
    ): UserSingleResult
    updateManyUser(ids: ID!, data: UserUpdate!): IdsResult
    deleteUser(id: ID!, previousData: UserUpdate!): UserSingleResult
    deleteManyUser(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createUser: (_, { data }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    updateUser: (_, { id, data }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    updateManyUser: (_, { ids, data, previousData }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    deleteUser: (_, { id, previousData }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    deleteManyUser: (_, { ids }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
  },
  Query: {
    getOneUser: (_, { id }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    getListUser: (_, { pagination, sort, filter }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    getListNativeUser: (_, { pagination, sort, filter }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    getManyUser: (_, { ids }, { dataProvider }) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
    getManyReferenceUser: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
  },

  User: {
    coursesIds: async (root, _, { dataProvider }) => {
      const linkTable = await dataProvider.getListNative('Student', {
        filter: { user: root.uid },
      })
      return linkTable.data.map((d) => d.course)
    },
    courses: async (root, { pagination, filter }, { dataProvider }) => {
      const linkTable = await dataProvider.getListNative('Student', {
        filter: { user: root.uid },
        pagination,
      })
      let ids = linkTable.data.map((d) => d.course)
      if (filter) {
        filter.id = { in: ids }
      } else {
        filter = { id: { in: ids } }
      }
      const result = await dataProvider.getList('Course', {
        filter,
        pagination,
      })
      return result.data
    },
    groupsIds: async (root, _, { dataProvider }) => {
      const linkTable = await dataProvider.getListNative('Student', {
        filter: { user: root.uid },
      })
      return linkTable.data.map((d) => d.group)
    },
    groups: async (root, { pagination, filter }, { dataProvider }) => {
      const linkTable = await dataProvider.getListNative('Student', {
        filter: { user: root.uid },
        pagination,
      })
      let ids = linkTable.data.map((d) => d.group)
      if (filter) {
        filter.id = { in: ids }
      } else {
        filter = { id: { in: ids } }
      }
      const result = await dataProvider.getList('Group', {
        filter,
        pagination,
      })
      return result.data
    },
    packagesIds: async (root, _, { dataProvider }) => {
      const linkTable = await dataProvider.getListNative('Student', {
        filter: { user: root.uid },
      })
      return linkTable.data.map((d) => d.coursePackage)
    },
    packages: async (root, { pagination, filter }, { dataProvider }) => {
      const linkTable = await dataProvider.getListNative('Student', {
        filter: { user: root.uid },
        pagination,
      })
      let ids = linkTable.data.map((d) => d.coursePackage)
      if (filter) {
        filter.id = { in: ids }
      } else {
        filter = { id: { in: ids } }
      }
      const result = await dataProvider.getList('CoursePackage', {
        filter,
        pagination,
      })
      return result.data
    },
    curatorIds: async (root, _, { dataProvider }) => {
      let filter = { user: root.uid }
      const res = await dataProvider.getListNative('Curator', { filter })
      return res.data.map((item) => item.id)
    },
    curator: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.user = root.uid
      } else {
        filter = { user: root.uid }
      }
      const res = await dataProvider.getListNative('Curator', {
        pagination,
        filter,
      })

      return res.data
    },
    capitanIds: async (root, _, { dataProvider }) => {
      let filter = { user: root.uid }
      const res = await dataProvider.getListNative('Capitan', { filter })
      return res.data.map((item) => item.id)
    },
    capitan: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.user = root.uid
      } else {
        filter = { user: root.uid }
      }
      const res = await dataProvider.getListNative('Capitan', {
        pagination,
        filter,
      })

      return res.data
    },
    studentIds: async (root, _, { dataProvider }) => {
      let filter = { user: root.uid }
      const res = await dataProvider.getListNative('Student', { filter })
      return res.data.map((item) => item.id)
    },
    student: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.user = root.uid
      } else {
        filter = { user: root.uid }
      }
      const res = await dataProvider.getListNative('Student', {
        pagination,
        filter,
      })

      return res.data
    },

    id: (root, args, context, info) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
  },
}
