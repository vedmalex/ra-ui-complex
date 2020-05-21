/// @merge:crc=77ee5637
import gql from 'graphql-tag'
export const schema = gql`
  type StudentSessions {
    id: ID!
    planDate: Date
    actualDate: Date
    done: Boolean
    comments: String
    studentId: ID
    student: Student
    leadId: ID
    lead: User
  }

  input StudentSessionsCreate {
    id: ID
    planDate: Date
    actualDate: Date
    done: Boolean
    comments: String
    student: ID
    lead: ID
  }
  input StudentSessionsUpdate {
    id: ID
    planDate: Date
    actualDate: Date
    done: Boolean
    comments: String
    student: ID
    lead: ID
  }

  type StudentSessionsListResult {
    data: [StudentSessions]
    total: Int
  }
  type StudentSessionsSingleResult {
    data: StudentSessions
  }

  extend type Query {
    getOneStudentSessions(id: ID!): StudentSessionsSingleResult
    getListStudentSessions(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentSessionsListResult
    getListNativeStudentSessions(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentSessionsListResult
    getManyStudentSessions(ids: [ID]!): StudentSessionsListResult
    getManyReferenceStudentSessions(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentSessionsListResult
  }

  extend type Mutation {
    createStudentSessions(
      data: StudentSessionsCreate!
    ): StudentSessionsSingleResult
    updateStudentSessions(
      id: ID
      data: StudentSessionsUpdate!
      previousData: StudentSessionsUpdate!
    ): StudentSessionsSingleResult
    updateManyStudentSessions(ids: ID!, data: StudentSessionsUpdate!): IdsResult
    deleteStudentSessions(
      id: ID!
      previousData: StudentSessionsUpdate!
    ): StudentSessionsSingleResult
    deleteManyStudentSessions(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createStudentSessions: (_, { data }, { dataProvider }) =>
      dataProvider.create('StudentSessions', { data }),
    updateStudentSessions: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('StudentSessions', { id, data, previousData }),
    updateManyStudentSessions: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('StudentSessions', { ids, data }),
    deleteStudentSessions: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('StudentSessions', { id, previousData }),
    deleteManyStudentSessions: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('StudentSessions', { ids }),
  },
  Query: {
    getOneStudentSessions: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('StudentSessions', { id }),
    getListStudentSessions: (
      _,
      { pagination, sort, filter },
      { dataProvider },
    ) => dataProvider.getList('StudentSessions', { pagination, sort, filter }),
    getListNativeStudentSessions: (
      _,
      { pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getListNative('StudentSessions', {
        pagination,
        sort,
        filter,
      }),
    getManyStudentSessions: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('StudentSessions', { ids }),
    getManyReferenceStudentSessions: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('StudentSessions', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  StudentSessions: {
    studentId: (root) => root.student,
    student: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Student', {
        filter: { id: root.student },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },

    leadId: (root) => root.lead,
    lead: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('User', {
        filter: { id: root.lead },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },
  },
}
