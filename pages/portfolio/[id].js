import { useState, useEffect } from "react";
import { getPortfolio } from "../../graphql/queries";
import { useRouter } from "next/router";
import { API } from "aws-amplify";
import { PortfolioView } from "../../components/PortfolioView";
export default function PublicPortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchQuote(symbol) {
    try {
      const res = await fetch(
        "https://cloud.iexapis.com/stable/stock/" +
          symbol +
          "/quote?token=" +
          process.env.NEXT_PUBLIC_IEX_CLOUD_API_KEY
      );
      const quote = await res.json();
      return { price: quote?.latestPrice, companyName: quote?.companyName };
    } catch (ex) {}
    return null;
  }

  async function fetchPortfolio() {
    const pf = await API.graphql({
      query: getPortfolio,
      variables: { id },
    });
    let tmpPortfolio = pf.data?.getPortfolio;
    let holdingsValue = 0;
    if (tmpPortfolio.Holdings.items.length > 0) {
      let arr = tmpPortfolio.Holdings.items;
      for (var i = 0; i < arr.length; i++) {
        let q = await fetchQuote(arr[i].symbol);
        if (!q || !q.price || isNaN(q.price)) continue;
        let p = q.price.toFixed(2);
        arr[i]["price"] = +p;
        const val = (+p * +arr[i].quantity).toFixed(2);
        holdingsValue += +val;
        arr[i]["value"] = val;
        let gain = (val - arr[i].cost).toFixed(2);
        let gainPct = +gain / arr[i].cost;
        arr[i]["gain"] = +gain;
        arr[i]["gainPct"] = +gainPct;
      }
      tmpPortfolio["value"] = +tmpPortfolio.availableFunds + holdingsValue;
      tmpPortfolio["performance"] = (
        (+tmpPortfolio["value"] - 50000) /
        50000
      ).toFixed(4);

      setPortfolio(tmpPortfolio);
    } else {
      // The portfolio has no holdings. Set the value to available funds
      tmpPortfolio["value"] = +tmpPortfolio.availableFunds;
      tmpPortfolio["performance"] = 0;
      setPortfolio(tmpPortfolio);
    }
  }

  return <PortfolioView portfolio={portfolio} />;
}
