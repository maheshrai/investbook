/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction {
    onCreateTransaction {
      id
      symbol
      type
      quantity
      amount
      when
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction {
    onUpdateTransaction {
      id
      symbol
      type
      quantity
      amount
      when
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction {
    onDeleteTransaction {
      id
      symbol
      type
      quantity
      amount
      when
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding {
    onCreateHolding {
      id
      symbol
      quantity
      cost
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding {
    onUpdateHolding {
      id
      symbol
      quantity
      cost
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding {
    onDeleteHolding {
      id
      symbol
      quantity
      cost
      portfolioID
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePortfolio = /* GraphQL */ `
  subscription OnCreatePortfolio {
    onCreatePortfolio {
      id
      username
      name
      description
      value
      investedAmount
      Holdings {
        items {
          id
          symbol
          quantity
          cost
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      Transactions {
        items {
          id
          symbol
          type
          quantity
          amount
          when
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePortfolio = /* GraphQL */ `
  subscription OnUpdatePortfolio {
    onUpdatePortfolio {
      id
      username
      name
      description
      value
      investedAmount
      Holdings {
        items {
          id
          symbol
          quantity
          cost
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      Transactions {
        items {
          id
          symbol
          type
          quantity
          amount
          when
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePortfolio = /* GraphQL */ `
  subscription OnDeletePortfolio {
    onDeletePortfolio {
      id
      username
      name
      description
      value
      investedAmount
      Holdings {
        items {
          id
          symbol
          quantity
          cost
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      Transactions {
        items {
          id
          symbol
          type
          quantity
          amount
          when
          portfolioID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
