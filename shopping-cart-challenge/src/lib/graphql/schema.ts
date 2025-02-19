import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Cart {
    _id: ID!
    hash: String!
    items: [CartItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type CartItem {
    _id: ID!
    cartId: ID!
    product: Product!
    quantity: Int!
    updatedAt: String!
    addedAt: String!
  }

  type Product {
    _id: ID!
    title: String!
    cost: Float!
    availableQuantity: Int!
    isArchived: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Visitor {
    _id: ID!
    token: String!
    cartId: ID!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input AddItemArgs {
    productId: ID!
    quantity: Int!
  }

  input RemoveItemArgs {
    cartItemId: ID!
  }

  input UpdateItemQuantityArgs {
    cartItemId: ID!
    quantity: Int!
  }

  enum CartItemEvent {
    ITEM_QUANTITY_UPDATED
    ITEM_OUT_OF_STOCK
  }

  type CartItemMessage {
    event: CartItemEvent!
    payload: CartItem!
  }

  type Mutation {
    register: Visitor!
    addItem(input: AddItemArgs!): Cart!
    removeItem(input: RemoveItemArgs!): Cart!
    updateItemQuantity(input: UpdateItemQuantityArgs!): Cart!
  }

  type GetProductsData {
    products: [Product!]!
    total: Int!
  }

  type Query {
    getCart: Cart!
    getProducts: GetProductsData!
  }

  type Subscription {
    cartItemUpdate: CartItemMessage!
  }
`;
