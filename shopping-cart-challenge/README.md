# E-Commerce Application (shopping-cart-challenge)

**Overview**
This project is an e-commerce style application that allows users to browse products, add them to their cart, and manage product quantities. The application features real-time notifications via WebSocket connections when cart quantities change.

## Features

User authentication (registration and login required for cart operations);
Shopping cart functionality;
Real-time notifications using GraphQL subscriptions,
Form validations using Zod.

## Technology Stack

**Frontend:** NextJS
** Styles**: TailwindCSS
**State Management:** Apollo Client
**API:** GraphQL (queries and mutations)
**Real-time Updates:** GraphQL WebSocket subscriptions
**Authentication:** JWT stored in cookies
**Form Validation:** Zod

## User Flow

- Users must register/login to access cart functionality;
- Upon successful authentication, a token is stored in cookies (expires after 1 hour);
- Users can browse and add products to their cart;
- Cart quantity can be increased/decreased;
- When cart quantity changes or reaches zero, users receive real-time notifications via **modal**.

---

### Development Notes

GraphQL subscriptions (graph-ws) provide real-time updates
Apollo Client is used for GraphQL operations

**For code reviewers:** .env file is included in the repository for evaluation purposes only. In production, these values would be secured properly.

#### Setup

1. Clone the repository
2. Install dependencies with npm install
3. Start the development server with **npm run dev**

##### Authentication

Token is stored in cookies with a 1-hour expiration period for security. Users will need to re-authenticate after this period.
Code Review Information
