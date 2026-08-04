import { queryOptions } from "@tanstack/react-query";

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  total_volume: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price: number[] };
};

export const CATEGORIES = [
  { id: "all", label: "Tudo", param: null },
  { id: "layer-1", label: "Layer 1", param: "layer-1" },
  { id: "meme-token", label: "Memes", param: "meme-token" },
  { id: "stablecoins", label: "Stablecoins", param: "stablecoins" },
  { id: "decentralized-finance-defi", label: "DeFi", param: "decentralized-finance-defi" },
  { id: "artificial-intelligence", label: "IA", param: "artificial-intelligence" },
  { id: "gaming", label: "Gaming", param: "gaming" },
] as const;

async function fetchCoins(category: string | null): Promise<Coin[]> {
  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", "60");
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "true");
  url.searchParams.set("price_change_percentage", "24h");
  if (category) url.searchParams.set("category", category);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Não foi possível carregar as cotações agora.");
  return (await res.json()) as Coin[];
}

export const coinsQuery = (category: string | null) =>
  queryOptions({
    queryKey: ["coins", category ?? "all"],
    queryFn: () => fetchCoins(category),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
