/// @merge:crc=d659f968
import gql from 'graphql-tag'
export const schema = gql`
  type Options {
    admin: Boolean
    student: Boolean
    capitan: Boolean
    curator: Boolean
    owner: Boolean
  }

  input OptionsCreate {
    admin: Boolean
    student: Boolean
    capitan: Boolean
    curator: Boolean
    owner: Boolean
  }
  input OptionsUpdate {
    admin: Boolean
    student: Boolean
    capitan: Boolean
    curator: Boolean
    owner: Boolean
  }
`

export const resolvers = {
  Options: {},
}
