/// @merge:crc=f17c885c
/// @merge:ignored
import gql from 'graphql-tag'
import { getDiffObject } from 'ra-gen-ui-lib/dist/client/diffObject'

import { resolvers as adminResolvers } from '../../admin'
import * as sortBy from 'sort-by'
import { makeFilter } from 'ra-gen-ui-lib/dist/client/filter'
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
    createUser: (_, { data }, { dataProvider }) => ({
      data: adminResolvers.Mutation.createAppUser(
        _,
        { user: data },
        { dataProvider },
      ),
    }),
    updateUser: (_, { id, data, previousData }, { dataProvider }) => ({
      data: adminResolvers.Mutation.updateAppUser(
        _,
        {
          uid: id,
          user: getDiffObject(previousData, data),
        },
        { dataProvider },
      ),
    }),
    updateManyUser: async (_, { ids, data }, { dataProvider }) => {
      const updateParams = ids.map((id) => ({
        id,
        data: data,
      }))
      const d = await Promise.all(
        updateParams.map((p) =>
          resolvers.Mutation.updateFireBaseUser(_, p, { dataProvider }),
        ),
      ).then((r) => r.map((d) => d.d.id))
      result = { data: d }
      return result
    },
    deleteUser: (_, { id, previousData }, { dataProvider }) => ({
      data: adminResolvers.Mutation.deleteAppUser(
        _,
        { uid: id },
        { dataProvider },
      ),
    }),
    deleteManyUser: async (_, { ids }, { dataProvider }) => {
      const delParams = ids.map((id) => ({
        id,
      }))
      const data = (
        await Promise.all(
          delParams.map((p) =>
            resolvers.Mutation.deleteFireBaseUser(_, p, {
              dataProvider,
            }),
          ),
        )
      ).map((r) => r.data.id)
      const result = { data }
      return result
    },
  },
  Query: {
    getOneUser: (_, { id }, { dataProvider }) => ({
      data: adminResolvers.Query.getAppUser(_, { uid: id }, { dataProvider }),
    }),
    getListUser: async (_, { pagination, sort, filter }, { dataProvider }) => {
      let pageToken
      let users = []
      let res
      do {
        res = await adminResolvers.Query.getAppUsers(
          _,
          {
            limit: 1000,
            pageToken,
          },
          { dataProvider },
        )
        pageToken = res.pageToken
        users = users.concat(res.users)
      } while (pageToken)

      users = users.map((u) => ({
        ...u,
        id: u.uid,
        options: u.options || u.customClaims,
      }))

      // console.log(makeFilter(filter || {}).toString());
      // console.log(users);
      const values = filter ? users.filter(makeFilter(filter)) : users

      if (sort) {
        values.sort(sortBy(`${sort.order === 'ASC' ? '-' : ''}${sort.field}`))
      }

      const { page, perPage } = pagination || {
        page: 1,
        perPage: 10,
      }
      const _start = (page - 1) * perPage
      const _end = page * perPage
      const data = values ? values.slice(_start, _end) : []
      const total = values ? values.length : 0
      return {
        data,
        total,
      }
    },
    getListNativeUser: (_, { pagination, sort, filter }, { dataProvider }) => {
      // custom mutations implementation
      // throw new Error('not implemented');
      // custom mutations implementation
    },
    getManyUser: (_, { ids }, { dataProvider }) =>
      resolvers.Query.getListUser(
        _,
        {
          filter: { 'uid-in': ids },
        },
        { dataProvider },
      ),
    getManyReferenceUser: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      resolvers.Query.getListUser(
        _,
        {
          filter: {
            ...filter,
            [target]: id,
          },
          pagination,
          sort,
        },
        { dataProvider },
      ),
  },

  User: {
    options: (root) => root.options || root.customClaims,
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
      const ids = linkTable.data.map((d) => d.course)
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
      const ids = linkTable.data.map((d) => d.group)
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
      const ids = linkTable.data.map((d) => d.coursePackage)
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
      const filter = { user: root.uid }
      const res = await dataProvider.getListNative('Curator', {
        pagination: { page: 1, perPage: 1000 },
        filter,
      })
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
      const filter = { user: root.uid }
      const res = await dataProvider.getListNative('Capitan', {
        pagination: { page: 1, perPage: 1000 },
        filter,
      })
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
      const filter = { user: root.uid }
      const res = await dataProvider.getListNative('Student', {
        pagination: { page: 1, perPage: 1000 },
        filter,
      })
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

    id: (root) => root.id || root.uid,
  },
}
