/// @merge:crc=bda556d4
import gql from 'graphql-tag'
export const schema = gql`
  type StudentHomeWork {
    id: ID!
    lessonId: ID
    lesson: Lesson
    studentId: ID
    student: Student
    curatorId: ID
    curator: Curator
    date: Date
    result: String
    comments: String
    reviewed: Boolean
  }

  input StudentHomeWorkCreate {
    id: ID
    lesson: ID
    student: ID
    curator: ID
    date: Date
    result: String
    comments: String
    reviewed: Boolean
  }
  input StudentHomeWorkUpdate {
    id: ID
    lesson: ID
    student: ID
    curator: ID
    date: Date
    result: String
    comments: String
    reviewed: Boolean
  }

  type StudentHomeWorkListResult {
    data: [StudentHomeWork]
    total: Int
  }
  type StudentHomeWorkSingleResult {
    data: StudentHomeWork
  }

  extend type Query {
    getOneStudentHomeWork(id: ID!): StudentHomeWorkSingleResult
    getListStudentHomeWork(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentHomeWorkListResult
    getListNativeStudentHomeWork(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentHomeWorkListResult
    getManyStudentHomeWork(ids: [ID]!): StudentHomeWorkListResult
    getManyReferenceStudentHomeWork(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): StudentHomeWorkListResult
  }

  extend type Mutation {
    createStudentHomeWork(
      data: StudentHomeWorkCreate!
    ): StudentHomeWorkSingleResult
    updateStudentHomeWork(
      id: ID
      data: StudentHomeWorkUpdate!
      previousData: StudentHomeWorkUpdate!
    ): StudentHomeWorkSingleResult
    updateManyStudentHomeWork(ids: ID!, data: StudentHomeWorkUpdate!): IdsResult
    deleteStudentHomeWork(
      id: ID!
      previousData: StudentHomeWorkUpdate!
    ): StudentHomeWorkSingleResult
    deleteManyStudentHomeWork(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createStudentHomeWork: (_, { data }, { dataProvider }) =>
      dataProvider.create('StudentHomeWork', { data }),
    updateStudentHomeWork: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('StudentHomeWork', { id, data, previousData }),
    updateManyStudentHomeWork: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('StudentHomeWork', { ids, data }),
    deleteStudentHomeWork: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('StudentHomeWork', { id, previousData }),
    deleteManyStudentHomeWork: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('StudentHomeWork', { ids }),
  },
  Query: {
    getOneStudentHomeWork: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('StudentHomeWork', { id }),
    getListStudentHomeWork: (
      _,
      { pagination, sort, filter },
      { dataProvider },
    ) => dataProvider.getList('StudentHomeWork', { pagination, sort, filter }),
    getListNativeStudentHomeWork: (
      _,
      { pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getListNative('StudentHomeWork', {
        pagination,
        sort,
        filter,
      }),
    getManyStudentHomeWork: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('StudentHomeWork', { ids }),
    getManyReferenceStudentHomeWork: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('StudentHomeWork', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  StudentHomeWork: {
    lessonId: (root) => root.lesson,
    lesson: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Lesson', {
        filter: { id: root.lesson },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },

    studentId: (root) => root.student,
    student: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Student', {
        filter: { id: root.student },
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
  },
}
