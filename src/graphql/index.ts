import { gql } from 'apollo-server';

export const rawSchema = {
  typeDefs: [
    gql`
      type Query {
        _empty: String
      }

      type Mutation {
        _empty: String
      }

      type Subscription {
        _empty: String
      }
    `
  ]
};
