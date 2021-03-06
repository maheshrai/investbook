/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTransaction = /* GraphQL */ `
  mutation CreateTransaction(
    $input: CreateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    createTransaction(input: $input, condition: $condition) {
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
export const updateTransaction = /* GraphQL */ `
  mutation UpdateTransaction(
    $input: UpdateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    updateTransaction(input: $input, condition: $condition) {
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
export const deleteTransaction = /* GraphQL */ `
  mutation DeleteTransaction(
    $input: DeleteTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    deleteTransaction(input: $input, condition: $condition) {
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
export const createHolding = /* GraphQL */ `
  mutation CreateHolding(
    $input: CreateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    createHolding(input: $input, condition: $condition) {
      id
      symbol
      companyName
      quantity
      cost
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const updateHolding = /* GraphQL */ `
  mutation UpdateHolding(
    $input: UpdateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    updateHolding(input: $input, condition: $condition) {
      id
      symbol
      companyName
      quantity
      cost
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const deleteHolding = /* GraphQL */ `
  mutation DeleteHolding(
    $input: DeleteHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    deleteHolding(input: $input, condition: $condition) {
      id
      symbol
      companyName
      quantity
      cost
      username
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const createPortfolio = /* GraphQL */ `
  mutation CreatePortfolio(
    $input: CreatePortfolioInput!
    $condition: ModelPortfolioConditionInput
  ) {
    createPortfolio(input: $input, condition: $condition) {
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
          companyName
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
export const updatePortfolio = /* GraphQL */ `
  mutation UpdatePortfolio(
    $input: UpdatePortfolioInput!
    $condition: ModelPortfolioConditionInput
  ) {
    updatePortfolio(input: $input, condition: $condition) {
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
          companyName
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
export const deletePortfolio = /* GraphQL */ `
  mutation DeletePortfolio(
    $input: DeletePortfolioInput!
    $condition: ModelPortfolioConditionInput
  ) {
    deletePortfolio(input: $input, condition: $condition) {
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
          companyName
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
