import { gql } from '@apollo/client';

export const ADD_ITEM = gql`
  mutation AddItem($input: AddItemArgs!) {
    addItem(input: $input) {
      _id
      hash
      items {
        _id
        quantity
      }
    }
  }
`;

export const REMOVE_ITEM = gql`
  mutation RemoveItem($input: RemoveItemArgs!) {
    removeItem(input: $input) {
      _id
      hash
      items {
        _id
      }
    }
  }
`;
