/// @merge:crc=8ed5cbef
import gql from 'graphql-tag'
export const schema = gql`
  type Course {
    id: ID!
    startDate: Date
    name: String!
    title: String
    packagesIds: [ID]
    packages(pagination: Pagination, filter: JSON): [CoursePackage]
    curatorsIds: [ID]
    curators(pagination: Pagination, filter: JSON): [Curator]
    capitansIds: [ID]
    capitans(pagination: Pagination, filter: JSON): [Capitan]
    groupsIds: [ID]
    groups(pagination: Pagination, filter: JSON): [Group]
    lessonsIds: [ID]
    lessons(pagination: Pagination, filter: JSON): [Lesson]
  }

  input CourseCreate {
    id: ID
    startDate: Date
    name: String!
  }
  input CourseUpdate {
    id: ID
    startDate: Date
    name: String
  }

  type CourseListResult {
    data: [Course]
    total: Int
  }
  type CourseSingleResult {
    data: Course
  }

  extend type Query {
    getOneCourse(id: ID!): CourseSingleResult
    getListCourse(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CourseListResult
    getListNativeCourse(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CourseListResult
    getManyCourse(ids: [ID]!): CourseListResult
    getManyReferenceCourse(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CourseListResult
  }

  extend type Mutation {
    createCourse(data: CourseCreate!): CourseSingleResult
    updateCourse(
      id: ID
      data: CourseUpdate!
      previousData: CourseUpdate!
    ): CourseSingleResult
    updateManyCourse(ids: ID!, data: CourseUpdate!): IdsResult
    deleteCourse(id: ID!, previousData: CourseUpdate!): CourseSingleResult
    deleteManyCourse(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createCourse: (_, { data }, { dataProvider }) =>
      dataProvider.create('Course', { data }),
    updateCourse: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Course', { id, data, previousData }),
    updateManyCourse: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Course', { ids, data }),
    deleteCourse: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Course', { id, previousData }),
    deleteManyCourse: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Course', { ids }),
  },
  Query: {
    getOneCourse: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Course', { id }),
    getListCourse: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Course', { pagination, sort, filter }),
    getListNativeCourse: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Course', { pagination, sort, filter }),
    getManyCourse: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Course', { ids }),
    getManyReferenceCourse: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Course', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Course: {
    packagesIds: async (root, _, { dataProvider }) => {
      let filter = { course: root.id }
      const res = await dataProvider.getListNative('CoursePackage', { filter })
      return res.data.map((item) => item.id)
    },
    packages: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.course = root.id
      } else {
        filter = { course: root.id }
      }
      const res = await dataProvider.getListNative('CoursePackage', {
        pagination,
        filter,
      })

      return res.data
    },
    curatorsIds: async (root, _, { dataProvider }) => {
      let filter = { course: root.id }
      const res = await dataProvider.getListNative('Curator', { filter })
      return res.data.map((item) => item.id)
    },
    curators: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.course = root.id
      } else {
        filter = { course: root.id }
      }
      const res = await dataProvider.getListNative('Curator', {
        pagination,
        filter,
      })

      return res.data
    },
    capitansIds: async (root, _, { dataProvider }) => {
      let filter = { course: root.id }
      const res = await dataProvider.getListNative('Capitan', { filter })
      return res.data.map((item) => item.id)
    },
    capitans: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.course = root.id
      } else {
        filter = { course: root.id }
      }
      const res = await dataProvider.getListNative('Capitan', {
        pagination,
        filter,
      })

      return res.data
    },
    groupsIds: async (root, _, { dataProvider }) => {
      let filter = { course: root.id }
      const res = await dataProvider.getListNative('Group', { filter })
      return res.data.map((item) => item.id)
    },
    groups: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.course = root.id
      } else {
        filter = { course: root.id }
      }
      const res = await dataProvider.getListNative('Group', {
        pagination,
        filter,
      })

      return res.data
    },
    lessonsIds: async (root, _, { dataProvider }) => {
      let filter = { course: root.id }
      const res = await dataProvider.getListNative('Lesson', { filter })
      return res.data.map((item) => item.id)
    },
    lessons: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.course = root.id
      } else {
        filter = { course: root.id }
      }
      const res = await dataProvider.getListNative('Lesson', {
        pagination,
        filter,
      })

      return res.data
    },

    title: (root, args, context, info) => {
      // custom mutations implementation
      //  throw new Error("not implemented")
      // custom mutations implementation
    },
  },
}
