import type { Coin } from "@/lib/coins";
import { Sparkline } from "./Sparkline";

const fmtPrice = (n: number) =>
  n >= 1
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })
    : `$${n.toPrecision(3)}`;

const fmtCap = (n: number) => {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

export function CoinCard({ coin }: { coin: Coin }) {
  const change = coin.price_change_percentage_24h ?? 0;
  const up = change >= 0;

  return (
    <a
      href={`https://www.coingecko.com/en/coins/${coin.id}`}
      target="_blank"
      rel="noreferrer"
      className="group mb-4 block break-inside-avoid rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-start gap-3">
        <img
          src={coin.image}
          alt={`Logo da criptomoeda ${coin.name}`}
          loading="lazy"
          className="size-9 rounded-full bg-secondary"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium tracking-tightest">{coin.name}</p>
          <p className="font-mono text-[11px] uppercase text-muted-foreground">
            {coin.symbol} · #{coin.market_cap_rank ?? "—"}
          </p>
        </div>
        <span
          className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] ${up ? "bg-up/10 text-up" : "bg-down/10 text-down"}`}
        >
          {up ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="font-mono text-lg tracking-tightest">{fmtPrice(coin.current_price)}</p>
        <Sparkline points={coin.sparkline_in_7d?.price ?? []} up={up} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
        <div>
          <dt className="uppercase tracking-wide opacity-70">Cap</dt>
          <dd className="text-foreground">{fmtCap(coin.market_cap)}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide opacity-70">Vol 24h</dt>
          <dd className="text-foreground">{fmtCap(coin.total_volume)}</dd>
        </div>
      </dl>
    </a>
  );
}
