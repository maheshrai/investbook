/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTransaction = /* GraphQL */ `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
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
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getHolding = /* GraphQL */ `
  query GetHolding($id: ID!) {
    getHolding(id: $id) {
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
export const listHoldings = /* GraphQL */ `
  query ListHoldings(
    $filter: ModelHoldingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
export const holdingsBySymbol = /* GraphQL */ `
  query HoldingsBySymbol(
    $symbol: String
    $sortDirection: ModelSortDirection
    $filter: ModelHoldingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    holdingsBySymbol(
      symbol: $symbol
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
`;
export const getPortfolio = /* GraphQL */ `
  query GetPortfolio($id: ID!) {
    getPortfolio(id: $id) {
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
export const listPortfolios = /* GraphQL */ `
  query ListPortfolios(
    $filter: ModelPortfolioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPortfolios(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        name
        description
        availableFunds
        createdAt
        updatedAt
        Transactions {
          nextToken
        }
        Holdings {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const portfoliosByUsername = /* GraphQL */ `
  query PortfoliosByUsername(
    $username: String
    $sortDirection: ModelSortDirection
    $filter: ModelPortfolioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    portfoliosByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        name
        description
        availableFunds
        createdAt
        updatedAt
        Transactions {
          nextToken
        }
        Holdings {
          nextToken
        }
      }
      nextToken
    }
  }
`;
