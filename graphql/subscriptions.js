/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction($username: String) {
    onCreateTransaction(username: $username) {
      id
      symbol
      type
      quantity
      amount
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction($username: String) {
    onUpdateTransaction(username: $username) {
      id
      symbol
      type
      quantity
      amount
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction($username: String) {
    onDeleteTransaction(username: $username) {
      id
      symbol
      type
      quantity
      amount
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding($username: String) {
    onCreateHolding(username: $username) {
      id
      symbol
      quantity
      cost
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding($username: String) {
    onUpdateHolding(username: $username) {
      id
      symbol
      quantity
      cost
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding($username: String) {
    onDeleteHolding(username: $username) {
      id
      symbol
      quantity
      cost
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePortfolio = /* GraphQL */ `
  subscription OnCreatePortfolio($username: String) {
    onCreatePortfolio(username: $username) {
      id
      username
      name
      description
      availableFunds
      createdAt
      updatedAt
      Transactions {
        items {
          id
          symbol
          type
          quantity
          amount
          username
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      Holdings {
        items {
          id
          symbol
          quantity
          cost
          username
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onUpdatePortfolio = /* GraphQL */ `
  subscription OnUpdatePortfolio($username: String) {
    onUpdatePortfolio(username: $username) {
      id
      username
      name
      description
      availableFunds
      createdAt
      updatedAt
      Transactions {
        items {
          id
          symbol
          type
          quantity
          amount
          username
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      Holdings {
        items {
          id
          symbol
          quantity
          cost
          username
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onDeletePortfolio = /* GraphQL */ `
  subscription OnDeletePortfolio($username: String) {
    onDeletePortfolio(username: $username) {
      id
      username
      name
      description
      availableFunds
      createdAt
      updatedAt
      Transactions {
        items {
          id
          symbol
          type
          quantity
          amount
          username
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      Holdings {
        items {
          id
          symbol
          quantity
          cost
          username
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
