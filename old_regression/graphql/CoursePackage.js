/// @merge:crc=57b1dde4
import gql from 'graphql-tag'
export const schema = gql`
  type CoursePackage {
    id: ID!
    title: String
    name: String!
    capitanSessions: Int
    curatorSessions: Int
    ownerSessions: Int
    courseId: ID
    course: Course
  }

  input CoursePackageCreate {
    id: ID
    name: String!
    capitanSessions: Int
    curatorSessions: Int
    ownerSessions: Int
    course: ID
  }
  input CoursePackageUpdate {
    id: ID
    name: String
    capitanSessions: Int
    curatorSessions: Int
    ownerSessions: Int
    course: ID
  }

  type CoursePackageListResult {
    data: [CoursePackage]
    total: Int
  }
  type CoursePackageSingleResult {
    data: CoursePackage
  }

  extend type Query {
    getOneCoursePackage(id: ID!): CoursePackageSingleResult
    getListCoursePackage(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CoursePackageListResult
    getListNativeCoursePackage(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CoursePackageListResult
    getManyCoursePackage(ids: [ID]!): CoursePackageListResult
    getManyReferenceCoursePackage(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): CoursePackageListResult
  }

  extend type Mutation {
    createCoursePackage(data: CoursePackageCreate!): CoursePackageSingleResult
    updateCoursePackage(
      id: ID
      data: CoursePackageUpdate!
      previousData: CoursePackageUpdate!
    ): CoursePackageSingleResult
    updateManyCoursePackage(ids: ID!, data: CoursePackageUpdate!): IdsResult
    deleteCoursePackage(
      id: ID!
      previousData: CoursePackageUpdate!
    ): CoursePackageSingleResult
    deleteManyCoursePackage(ids: [ID!]!): IdsResult
  }
`

export const resolvers = {
  Mutation: {
    createCoursePackage: (_, { data }, { dataProvider }) =>
      dataProvider.create('CoursePackage', { data }),
    updateCoursePackage: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('CoursePackage', { id, data, previousData }),
    updateManyCoursePackage: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('CoursePackage', { ids, data }),
    deleteCoursePackage: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('CoursePackage', { id, previousData }),
    deleteManyCoursePackage: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('CoursePackage', { ids }),
  },
  Query: {
    getOneCoursePackage: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('CoursePackage', { id }),
    getListCoursePackage: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('CoursePackage', { pagination, sort, filter }),
    getListNativeCoursePackage: (
      _,
      { pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getListNative('CoursePackage', { pagination, sort, filter }),
    getManyCoursePackage: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('CoursePackage', { ids }),
    getManyReferenceCoursePackage: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('CoursePackage', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  CoursePackage: {
    courseId: (root) => root.course,
    course: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Course', {
        filter: { id: root.course },
        pagination: { page: 1, perPage: 1 },
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
