import { withAuthenticator } from "@aws-amplify/ui-react";
import { API, Auth } from "aws-amplify";
import { useState, useEffect } from "react";
import { portfoliosByUsername, listHoldings } from "../graphql/queries";
import {
  createTransaction,
  createHolding,
  createPortfolio,
  updatePortfolio,
} from "../graphql/mutations";
function Portfolio() {
  // USD currency formatter
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [exists, setExists] = useState(true);
  const [transaction, setTransaction] = useState("BUY");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [invalidTransaction, setInvalidTransaction] = useState(false);

  const handleTransactionChange = (event) => setTransaction(event.target.value);
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
    updatePrice(event.target.value);
  };
  const handleQuantityChange = (event) => setQuantity(event.target.value);
  const handlePortfolioNameChange = (event) =>
    setPortfolioName(event.target.value);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    setUser(user);
  }

  async function updatePrice(symbol) {
    const p = await fetchQuote(symbol);
    setPrice(p);
  }

  async function fetchQuote(symbol) {
    try {
      const res = await fetch(
        "https://cloud.iexapis.com/stable/stock/" +
          symbol +
          "/quote?token=" +
          process.env.NEXT_PUBLIC_IEX_CLOUD_API_KEY
      );
      const quote = await res.json();
      return quote?.delayedPrice;
    } catch (ex) {}
    return NaN;
  }

  async function fetchPortfolio() {
    const { username } = await Auth.currentAuthenticatedUser();
    const portfolioData = await API.graphql({
      query: portfoliosByUsername,
      variables: { username },
    });
    if (
      portfolioData.data.portfoliosByUsername.items &&
      portfolioData.data.portfoliosByUsername.items.length > 0
    ) {
      const tmpPortfolio = portfolioData.data.portfoliosByUsername.items[0];
      const holdingsData = await API.graphql({
        query: listHoldings,
        filter: {
          portfolioID: { eq: portfolio?.id },
        },
      });
      let holdingsValue = 0;
      if (holdingsData.data.listHoldings.items.length > 0) {
        let arr = holdingsData.data.listHoldings.items;
        for (var i = 0; i < arr.length; i++) {
          const p = await fetchQuote(arr[i].symbol);
          arr[i]["price"] = p;
          const val = p * arr[i].quantity;
          holdingsValue += val;
          arr[i]["value"] = val;
          let gain = val - arr[i].cost;
          let gainPct = (gain / arr[i].cost) * 100;
          arr[i]["gain"] = gain;
          arr[i]["gainPct"] = gainPct;
        }
        tmpPortfolio["value"] = tmpPortfolio.availableFunds + holdingsValue;
        setPortfolio(tmpPortfolio);
        setHoldings(arr);
      } else {
        // The portfolio has no holdings. Set the value to available funds
        tmpPortfolio["value"] = tmpPortfolio.availableFunds;
        setPortfolio(tmpPortfolio);
      }
    } else {
      setExists(false);
    }
  }

  async function createMyPortfolio() {
    setExists(true);
    const p = {
      name: portfolioName,
      description: portfolioName,
      availableFunds: 50000,
    };
    try {
      await API.graphql({
        query: createPortfolio,
        variables: { input: p },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      fetchPortfolio();
    } catch (err) {
      console.log(err);
      exists = false;
    }
  }

  // Validate that the transaction is valid
  function isTransactionValid() {
    try {
      if (transaction === "BUY") {
        let amount = quantity * parseFloat(price);
        if (amount <= portfolio.availableFunds) return true;
      } else if (transaction === "SELL") {
        let holding = holdings.find((h) => h.symbol === symbol);
        if (holding && holding.quantity >= quantity) return true;
      }
    } catch (err) {}
    return false;
  }

  async function updateMyPortfolio() {
    if (!isTransactionValid()) {
      return;
    }
    const cost = quantity * parseFloat(price);
    const t = {
      type: transaction,
      symbol: symbol,
      quantity: quantity,
      amount: cost,
      portfolioID: portfolio.id,
    };
    const h = {
      symbol: symbol,
      quantity: quantity,
      cost: cost,
      portfolioID: portfolio.id,
    };
    await API.graphql({
      query: createTransaction,
      variables: { input: t },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    await API.graphql({
      query: createHolding,
      variables: { input: h },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    // update the portfolio's available funds
    const portfolioDetails = {
      id: portfolio.id,
      availableFunds:
        transaction === "BUY"
          ? portfolio.availableFunds - cost
          : portfolio.availableFunds + cost,
    };
    await API.graphql({
      query: updatePortfolio,
      variables: { input: portfolioDetails },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    fetchPortfolio();
  }
  if (!user) return null;
  return (
    <>
      <div className={exists ? "hidden" : "mt-4 max-w-md"}>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Create a portfolio
        </p>
        <p className="pb-4 mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Start with $50,000 paper money and invest in stocks. Start by creating
          a portfolio.
        </p>
        <label className="pb-4 block">
          <span className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Name of your portfolio
          </span>
          <input
            type="text"
            onChange={handlePortfolioNameChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder=""
          />
        </label>
        <button
          onClick={async () => createMyPortfolio()}
          className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700"
        >
          Create Portfolio
        </button>
      </div>

      <div className={!exists ? "hidden" : "flex flex-col"}>
        {portfolio && (
          <p className="pb-4 text-lg text-black font-semibold">
            {portfolio?.name}
          </p>
        )}
        {portfolio && (
          <p className="pb-4 text-md font-semibold">
            <span className="text-black">Portfolio Value: </span>
            <span
              className={
                portfolio?.value >= 50000 ? "text-green-500" : "text-red-500"
              }
            >
              {currencyFormatter.format(portfolio?.value)}
            </span>
            <span className="pl-4 text-black">Funds available: </span>
            <span
              className={
                portfolio?.value >= 50000 ? "text-green-500" : "text-red-500"
              }
            >
              {currencyFormatter.format(portfolio?.availableFunds)}
            </span>
          </p>
        )}
        {holdings?.length > 0 && (
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="table-auto min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        SYM
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        QTY
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cost
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Value
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Gain($)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Gain(%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {holdings.map((holding, index) => (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {holding?.symbol}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {holding?.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {currencyFormatter.format(holding?.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {currencyFormatter.format(holding?.cost)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {holding?.value}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={
                              holding?.gain < 0
                                ? "text-sm text-red-700"
                                : "text-sm text-green-700"
                            }
                          >
                            {currencyFormatter.format(holding?.gain)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={
                              holding?.gain < 0
                                ? "text-sm text-red-700"
                                : "text-sm text-green-700"
                            }
                          >
                            {holding?.gainPct}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {invalidTransaction && (
          <p className="py-4 text-md font-semibold">Error</p>
        )}
        <div className="py-4 grid grid-cols-3 gap-4 md:grid-cols-6">
          <select
            onChange={handleTransactionChange}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option key="BUY" value="BUY">
              Buy
            </option>
            <option key="SELL" value="SELL">
              Sell
            </option>
          </select>
          <input
            type="text"
            onChange={handleSymbolChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="SYM"
          />
          {!isNaN(price) && (
            <div className="bg-indigo-500 px-6 py-3 text-white text-center font-extrabold rounded-full">
              {price}
            </div>
          )}
          <input
            type="number"
            onChange={handleQuantityChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="QTY"
          />
          {!isNaN(price) && !isNaN(quantity) && (
            <div className="bg-indigo-500 px-6 py-3 text-white text-center font-extrabold rounded-full">
              {price * quantity}
            </div>
          )}
          <button
            onClick={async () => updateMyPortfolio()}
            disabled={!isTransactionValid()}
            className={
              isTransactionValid()
                ? "py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-600 hover:bg-green-900"
                : "py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-600 hover:bg-green-900 opacity-50"
            }
          >
            {transaction === "BUY" ? "Buy" : "Sell"}
          </button>
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(Portfolio);
