import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    getProducts {
      products {
        _id
        title
        cost
        availableQuantity
        isArchived
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CART = gql`
  query {
    getCart {
      _id
      hash
      items {
        _id
        product {
          _id
          title
          cost
          availableQuantity
        }
        quantity
      }
    }
  }
`;

export const ADD_ITEM = gql`
  mutation addItem($productId: ID!, $quantity: Int!) {
    addItem(input: { productId: $productId, quantity: $quantity }) {
      _id
      hash
      items {
        _id
        product {
          _id
          title
          cost
        }
        quantity
      }
    }
  }
`;

export const REMOVE_ITEM = gql`
  mutation removeItem($cartItemId: ID!) {
    removeItem(input: { cartItemId: $cartItemId }) {
      _id
      hash
      items {
        _id
        product {
          _id
          title
          cost
        }
        quantity
      }
    }
  }
`;
