/// @merge:crc=a77fb6e5
import gql from 'graphql-tag'
export const schema = gql`
  type ContactInformation {
    email: String
    phone: String
    skype: String
    vk: String
    facebook: String
    city: String
  }

  input ContactInformationCreate {
    email: String
    phone: String
    skype: String
    vk: String
    facebook: String
    city: String
  }
  input ContactInformationUpdate {
    email: String
    phone: String
    skype: String
    vk: String
    facebook: String
    city: String
  }
`

export const resolvers = {
  ContactInformation: {},
}
