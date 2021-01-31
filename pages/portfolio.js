import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API, Auth } from "aws-amplify";
import { useState, useEffect } from "react";
import { portfoliosByUsername, listHoldings } from "../graphql/queries";
import {
  createTransaction,
  createHolding,
  createPortfolio,
} from "../graphql/mutations";
function Portfolio() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [exists, setExists] = useState(true);
  const [trasaction, setTransaction] = useState("BUY");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [portfolioName, setPortfolioName] = useState("");

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
      setPortfolio(portfolioData.data.portfoliosByUsername.items[0]);

      const holdingsData = await API.graphql({
        query: listHoldings,
        filter: {
          portfolioID: { eq: portfolio?.id },
        },
      });
      if (holdingsData.data.listHoldings.items.length > 0) {
        let arr = holdingsData.data.listHoldings.items;
        for (var i = 0; i < arr.length; i++) {
          const p = await fetchQuote(arr[i].symbol);
          arr[i]["price"] = p;
          const val = p * arr[i].quantity;
          arr[i]["value"] = val;
          let gain = val - arr[i].cost;
          let gainPct = (gain / arr[i].cost) * 100;
          arr[i]["gain"] = gain;
          arr[i]["gainPct"] = gainPct;
        }
        setHoldings(arr);
      }
    } else {
      setExists(false);
    }
  }

  async function createMyPortfolio() {
    const p = {
      name: portfolioName,
      description: portfolioName,
      availableFunds: 50000,
    };
    await API.graphql({
      query: createPortfolio,
      variables: { input: p },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    fetchPortfolio();
  }

  async function updatePortfolio() {
    const t = {
      type: trasaction,
      symbol: symbol,
      quantity: quantity,
      amount: quantity * parseFloat(price),
      portfolioID: portfolio.id,
    };
    const h = {
      symbol: symbol,
      quantity: quantity,
      cost: quantity * parseFloat(price),
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
  }
  if (!user) return null;
  return (
    <div>
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
        <p className="pb-4 text-lg text-black font-semibold">
          {portfolio?.name}
        </p>
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
                          {holding.symbol}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {holding.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {holding.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {holding.cost}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {holding.value}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={
                            holding.gain < 0
                              ? "text-sm text-red-700"
                              : "text-sm text-green-700"
                          }
                        >
                          {holding.gain}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={
                            holding.gain < 0
                              ? "text-sm text-red-700"
                              : "text-sm text-green-700"
                          }
                        >
                          {holding.gainPct}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
          <input
            type="number"
            onChange={handleQuantityChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="QTY"
          />
          <button
            onClick={async () => updatePortfolio()}
            className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-600 hover:bg-green-900"
          >
            {trasaction === "BUY" ? "Buy" : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(Portfolio);
