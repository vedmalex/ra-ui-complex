/// @merge:crc=b6242e7d
import gql from 'graphql-tag'
export const schema = gql`
  type Lesson {
    id: ID!
    courseId: ID
    course: Course
    name: String
    homework: String
    homeworksIds: [ID]
    homeworks(pagination: Pagination, filter: JSON): [StudentHomeWork]
  }

  input LessonCreate {
    id: ID
    course: ID
    name: String
    homework: String
  }
  input LessonUpdate {
    id: ID
    course: ID
    name: String
    homework: String
  }

  type LessonListResult {
    data: [Lesson]
    total: Int
  }
  type LessonSingleResult {
    data: Lesson
  }

  extend type Query {
    getOneLesson(id: ID!): LessonSingleResult
    getListLesson(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): LessonListResult
    getListNativeLesson(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): LessonListResult
    getManyLesson(ids: [ID]!): LessonListResult
    getManyReferenceLesson(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): LessonListResult
  }

  extend type Mutation {
    createLesson(data: LessonCreate!): LessonSingleResult
    updateLesson(
      id: ID
      data: LessonUpdate!
      previousData: LessonUpdate!
    ): LessonSingleResult
    updateManyLesson(ids: ID!, data: LessonUpdate!): IdsResult
    deleteLesson(id: ID!, previousData: LessonUpdate!): LessonSingleResult
    deleteManyLesson(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createLesson: (_, { data }, { dataProvider }) =>
      dataProvider.create('Lesson', { data }),
    updateLesson: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Lesson', { id, data, previousData }),
    updateManyLesson: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Lesson', { ids, data }),
    deleteLesson: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Lesson', { id, previousData }),
    deleteManyLesson: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Lesson', { ids }),
  },
  Query: {
    getOneLesson: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Lesson', { id }),
    getListLesson: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Lesson', { pagination, sort, filter }),
    getListNativeLesson: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Lesson', { pagination, sort, filter }),
    getManyLesson: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Lesson', { ids }),
    getManyReferenceLesson: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Lesson', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Lesson: {
    courseId: (root) => root.course,
    course: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Course', {
        filter: { id: root.course },
        pagination: { page: 1, perPage: 1 },
      })

      return res.data
    },
    homeworksIds: async (root, _, { dataProvider }) => {
      let filter = { lessons: root.id }
      const res = await dataProvider.getListNative('StudentHomeWork', {
        filter,
      })
      return res.data.map((item) => item.id)
    },
    homeworks: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.lessons = root.id
      } else {
        filter = { lessons: root.id }
      }
      const res = await dataProvider.getListNative('StudentHomeWork', {
        pagination,
        filter,
      })

      return res.data
    },
  },
}
