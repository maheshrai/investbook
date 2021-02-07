import { useState, useEffect } from "react";
import { getPortfolio, holdingsBySymbol } from "../graphql/queries";
import { API } from "aws-amplify";
export default function Stocks() {
  const mktCapFormat = Intl.NumberFormat("en", { notation: "compact" });
  const percentageFormatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const [stockStats, setStockStats] = useState(null);
  const [portfolios, setPortfolios] = useState(null);
  const [symbol, setSymbol] = useState("");

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value.toUpperCase());
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      updateStats();
      findPortfolios();
    }
  };

  async function updateStats() {
    let stats = await fetchStats(symbol);
    setStockStats(stats);
  }

  async function findPortfolios() {
    const holdingsData = await API.graphql({
      query: holdingsBySymbol,
      variables: { limit: 10, symbol },
    });
    if (holdingsData.data.holdingsBySymbol.items.length > 0) {
      const holdings = holdingsData.data.holdingsBySymbol.items;
      let parr = [];
      for (var i = 0; i < holdings.length; i++) {
        let portfolioData = await API.graphql({
          query: getPortfolio,
          variables: { id: holdings[i].portfolioID },
        });
        let portfolio = portfolioData?.data?.getPortfolio;

        // Get total value of the portfolio
        // Need to convert to a lambda function later
        let portfolioValue = +portfolio.availableFunds;
        const portfolio_holdings = portfolio.Holdings.items;
        for (var j = 0; j < portfolio_holdings.length; j++) {
          const stats = await fetchStats(portfolio_holdings[j].symbol);
          if (stats && stats.latestPrice) {
            let hval = (
              +stats.latestPrice * +portfolio_holdings[j].quantity
            ).toFixed(2);
            portfolioValue += +hval;
          }
        }

        portfolio["performance"] = percentageFormatter.format(
          (+portfolioValue - 50000) / 50000
        );
        parr.push(portfolio);
      }
      setPortfolios(parr);
    } else {
      setPortfolios([]);
    }
  }

  async function fetchStats(symbol) {
    try {
      const res = await fetch(
        "https://cloud.iexapis.com/stable/stock/" +
          symbol +
          "/quote?token=" +
          process.env.NEXT_PUBLIC_IEX_CLOUD_API_KEY
      );
      const stats = await res.json();
      return stats;
    } catch (ex) {}
    return null;
  }

  return (
    <div>
      <label className="block">
        <span className="text-gray-700">Search Stock</span>
        <input
          type="text"
          onChange={handleSymbolChange}
          onKeyUp={handleEnter}
          className="mt-1 max-w-md focus-within: block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="e.g. AAPL for Apple Inc. Press Enter to search."
        />
      </label>

      <div class="py-6 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="table-auto min-w-full divide-y divide-gray-200">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">Company</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 font-black">
                      {stockStats?.companyName}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">Market Cap</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 font-black">
                      {stockStats
                        ? mktCapFormat.format(stockStats?.marketCap)
                        : ""}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">Price</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 font-black">
                      {stockStats?.latestPrice}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">P/E</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 font-black">
                      {stockStats?.peRatio?.toFixed(0)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">52 Wk High</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 font-black">
                      {stockStats?.week52High}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">52 Wk Low</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 font-black">
                      {stockStats?.week52Low}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {portfolios && (
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Portfolios holding{" "}
          <span className="font-black">{stockStats?.companyName}</span>
        </h2>
      )}

      {portfolios && (
        <div class="py-6 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Performance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolios.map((p, index) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {p.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={
                            +p.performance?.gain < 0
                              ? "text-sm text-red-700"
                              : "text-sm text-green-700"
                          }
                        >
                          {p.performance}
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
    </div>
  );
}
