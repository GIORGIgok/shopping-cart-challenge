import { gql } from '@apollo/client';

export const CART_ITEM_UPDATE = gql`
  subscription CartItemUpdate {
    cartItemUpdate {
      event
      payload {
        _id
        product {
          _id
          title
        }
        quantity
      }
    }
  }
`;

export const ITEM_QUANTITY_UPDATED = gql`
  subscription ItemQuantityUpdated {
    itemQuantityUpdated {
      _id
      quantity
      product {
        title
        cost
      }
    }
  }
`;

export const ITEM_OUT_OF_STOCK = gql`
  subscription ItemOutOfStock {
    itemOutOfStock {
      _id
      product {
        title
        cost
      }
    }
  }
`;
