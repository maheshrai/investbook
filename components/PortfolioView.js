export function PortfolioView(props) {
  // USD currency formatter
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Percentage Formatter
  const percentageFormatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const portfolio = props.portfolio;
  const holdings = props.portfolio?.Holdings?.items;
  return (
    <div>
      {portfolio && (
        <p className="pb-4 text-lg text-black font-semibold">
          {portfolio?.name}
        </p>
      )}
      {portfolio && (
        <p className="pb-4 text-md font-semibold">
          <div>
            <span className="text-black">Portfolio Value ($50,000): </span>
            <span
              className={
                portfolio?.value >= 50000 ? "text-green-500" : "text-red-500"
              }
            >
              {currencyFormatter.format(portfolio?.value)}
            </span>
          </div>
          <div>
            <span className="text-black">Funds available to invest: </span>
            <span className="text-blue-500">
              {currencyFormatter.format(portfolio?.availableFunds)}
            </span>
          </div>
          <div>
            <span className="text-black">Portfolio Performance: </span>
            <span
              className={
                portfolio?.performance < 0 ? "text-red-500" : "text-green-500"
              }
            >
              {percentageFormatter.format(portfolio?.performance)}
            </span>
          </div>
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
                      Symbol
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
                      Gain
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
                        <div className="text-xs text-gray-900">
                          {holding?.companyName}
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
                          {currencyFormatter.format(holding?.value)}
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
                            +holding?.gain < 0
                              ? "text-sm text-red-700"
                              : "text-sm text-green-700"
                          }
                        >
                          {percentageFormatter.format(holding?.gainPct)}
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
