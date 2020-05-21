/// @merge:crc=638f48e3
import gql from 'graphql-tag';
import OCL from '@stekoe/ocl.js';

export const schema = gql`
  type Todo {
    id: ID!
    name: String
    text: String
    checked: Boolean
    userId: ID
    user: User
    parentId: ID
    parent: Todo
    childrenIds: [ID]
    children(pagination: Pagination, filter: JSON): [Todo]
  }

  input TodoCreate {
    id: ID
    name: String
    text: String
    checked: Boolean
    user: ID
    parent: ID
  }
  input TodoUpdate {
    id: ID
    name: String
    text: String
    checked: Boolean
    user: ID
    parent: ID
  }

  type TodoListResult {
    data: [Todo]
    total: Int
  }
  type TodoSingleResult {
    data: Todo
  }

  extend type Query {
    getOneTodo(id: ID!): TodoSingleResult
    getListTodo(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): TodoListResult
    getListNativeTodo(
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): TodoListResult
    getManyTodo(ids: [ID]!): TodoListResult
    getManyReferenceTodo(
      target: String
      id: ID
      pagination: Pagination
      sort: Sort
      filter: JSON
    ): TodoListResult
  }

  extend type Mutation {
    createTodo(data: TodoCreate!): TodoSingleResult
    updateTodo(
      id: ID
      data: TodoUpdate!
      previousData: TodoUpdate!
    ): TodoSingleResult
    updateManyTodo(ids: ID!, data: TodoUpdate!): IdsResult
    deleteTodo(id: ID!, previousData: TodoUpdate!): TodoSingleResult
    deleteManyTodo(ids: [ID!]!): IdsResult
  }
`;

export const resolvers = {
  Mutation: {
    createTodo: (_, { data }, { dataProvider }) =>
      dataProvider.create('Todo', { data }),
    updateTodo: (_, { id, data, previousData }, { dataProvider }) =>
      dataProvider.update('Todo', { id, data, previousData }),
    updateManyTodo: (_, { ids, data }, { dataProvider }) =>
      dataProvider.updateMany('Todo', { ids, data }),
    deleteTodo: (_, { id, previousData }, { dataProvider }) =>
      dataProvider.delete('Todo', { id, previousData }),
    deleteManyTodo: (_, { ids }, { dataProvider }) =>
      dataProvider.deleteMany('Todo', { ids }),
  },
  Query: {
    getOneTodo: (_, { id }, { dataProvider }) =>
      dataProvider.getOne('Todo', { id }),
    getListTodo: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getList('Todo', { pagination, sort, filter }),
    getListNativeTodo: (_, { pagination, sort, filter }, { dataProvider }) =>
      dataProvider.getListNative('Todo', { pagination, sort, filter }),
    getManyTodo: (_, { ids }, { dataProvider }) =>
      dataProvider.getMany('Todo', { ids }),
    getManyReferenceTodo: (
      _,
      { target, id, pagination, sort, filter },
      { dataProvider },
    ) =>
      dataProvider.getManyReference('Todo', {
        target,
        id,
        pagination,
        sort,
        filter,
      }),
  },

  Todo: {
    name: root => {
      debugger;
      const ocl = OCL.create();
      ocl.addOclExpression(`
      context Object::name : String
        derive: self.name or self.text
      `);
      const result = ocl.evaluate(root);
      console.log(result);
      return root.name;
    },
    userId: root => root.user,
    user: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('User', {
        filter: { id: root.user },
        pagination: { page: 1, perPage: 1 },
      });

      return res.data;
    },

    parentId: root => root.parent,
    parent: async (root, _, { dataProvider }) => {
      const res = await dataProvider.getListNative('Todo', {
        filter: { id: root.parent },
        pagination: { page: 1, perPage: 1 },
      });

      return res.data;
    },
    childrenIds: async (root, _, { dataProvider }) => {
      let filter = { parent: root.id };
      const res = await dataProvider.getListNative('Todo', { filter });
      return res.data.map(item => item.id);
    },
    children: async (root, { pagination, filter }, { dataProvider }) => {
      if (filter) {
        filter.parent = root.id;
      } else {
        filter = { parent: root.id };
      }
      const res = await dataProvider.getListNative('Todo', {
        pagination,
        filter,
      });

      return res.data;
    },
  },
};
