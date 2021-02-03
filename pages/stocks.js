import { useState, useEffect } from "react";
export default function Stocks() {
  const mktCapFormat = Intl.NumberFormat("en", { notation: "compact" });
  const [stockStats, setStockStats] = useState(null);
  const [symbol, setSymbol] = useState("");

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value.toUpperCase());
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      updateStats();
    }
  };

  async function updateStats() {
    let stats = await fetchStats(symbol);
    setStockStats(stats);
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
                      {stockStats?.peRatio.toFixed(0)}
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
    </div>
  );
}
