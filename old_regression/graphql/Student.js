/// @merge:crc=3959bdb4
import gql from 'graphql-tag'
export const schema = gql`
  type Student {
    id: ID!
    fullName: String!
    gender: Gender
    contact: ContactInformation
    courseId: ID
    course: Course
    groupId: ID
    group: Group
    packageId: ID
    package: CoursePackage
    userId: ID
    user: User
    instalments: Boolean
    retraining: Boolean
    legalGuarantee: Boolean
    homeworksIds: [ID]
    homeworks(pagination: Pagination, filter: JSON): [StudentHomeWork]
  }

  input StudentCreate {
    id: ID
    fullName: String!
    gender: Gender
    contact: ContactInformationCreate
    course: ID
    group: ID
    package: ID
    user: ID
    instalments: Boolean
    retraining: Boolean
    legalGuarantee: Boolean
  }
  input StudentUpdate {
    id: ID
    fullName: String
    gender: Gender
    contact: ContactInformationUpdate
    course: ID
    group: ID
    package: ID
    user: ID
    instalments: Boolean
    retraining: Boolean
    legalGuarantee: Boolean
  }

  type StudentListResult {
    data: [Student]
    total: Int
  }
  type StudentSingleResult {
    data: Student
  }

  extend type Query {
    getOneStudent(id: ID!): StudentSingleResult
    getListStudent(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentListResult
    getListNativeStudent(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentListResult
    getManyStudent(ids: [ID]!): StudentListResult
    getManyReferenceStudent(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentListResult
  }

  extend type Mutation {
    createStudent(data: StudentCreate!): StudentSingleResult
    updateStudent(
      id: ID
      data: StudentUpdate!
      previousData: StudentUpdate!
    ): StudentSingleResult
    updateManyStudent(ids: ID!, data: StudentUpdate!): IdsResult
    deleteStudent(id: ID!, previousData: StudentUpdate!): StudentSingleResult
    deleteManyStudent(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createStudent: (_, { data }, { dataProvider }) =>
      dataProvider.create('Student', { data }),
    updateStudent: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Student', { id, data, previousData }),
    updateManyStudent: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Student', { ids, data }),
    deleteStudent: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Student', { id, previousData }),
    deleteManyStudent: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Student', { ids }),
  },
  Query: {
    getOneStudent: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Student', { id }),
    getListStudent: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Student', { pagination, sort, filter }),
    getListNativeStudent: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Student', { pagination, sort, filter }),
    getManyStudent: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Student', { ids }),
    getManyReferenceStudent: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Student', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Student: {
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

    packageId: (root) => root.package,
    package: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('CoursePackage', {
        filter: { id: root.package },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },

    userId: (root) => root.user,
    user: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('User', {
        filter: { id: root.user },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },
    homeworksIds: async (root, _, { dataProvider }) => {
      let filter = { student: root.id }
      const res = await dataProvider.getListNative('StudentHomeWork', {
        filter,
      })
      return res.data.map((item) => item.id)
    },
    homeworks: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.student = root.id
      } else {
        filter = { student: root.id }
      }
      const res = await dataProvider.getListNative('StudentHomeWork', {
        pagination,
        filter,
      })

      return res.data
    },
  },
}
