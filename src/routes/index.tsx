import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CATEGORIES, coinsQuery, type Coin } from "@/lib/coins";
import { CoinCard } from "@/components/CoinCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cripto Search — busca visual de criptomoedas" },
      {
        name: "description",
        content:
          "Busque e explore criptomoedas em uma grade visual: preço em tempo real, variação 24h, market cap e gráfico de 7 dias.",
      },
      { property: "og:title", content: "Cripto Index — busca visual de criptomoedas" },
      {
        property: "og:description",
        content:
          "Uma grade limpa para descobrir moedas: preço, variação 24h e tendência de 7 dias.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [category, setCategory] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const { data, isLoading, isError, error } = useQuery(coinsQuery(category));

  const coins = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list: Coin[] = data ?? [];
    if (!term) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term),
    );
  }, [data, q]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-375 items-center gap-4 px-5 py-3">
          <span className="font-mono text-[13px] font-medium uppercase tracking-tightest">
            Cripto Search
          </span>
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar moedas, tickers…"
              aria-label="Buscar criptomoedas"
              className="h-9 w-full rounded-full border border-border bg-secondary px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:bg-card"
            />
          </div>
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">
            {coins.length} resultados
          </span>
        </div>

        <nav className="mx-auto flex max-w-375 gap-1 overflow-x-auto px-5 pb-3">
          {CATEGORIES.map((c) => {
            const active = (c.param ?? null) === category;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.param ?? null)}
                className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
                {c.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-375 px-5 py-8">
        <h1 className="max-w-2xl text-4xl leading-[1.05] tracking-tightest sm:text-5xl">
          Um mural vivo do mercado cripto.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Preços, variação de 24 horas e tendência de 7 dias atualizados a cada minuto.
        </p>

        <div className="mt-8">
        {isLoading && (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="mb-4 h-44 animate-pulse rounded-xl bg-secondary" />
              ))}
            </div>
          )}

          {isError && (
            <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              {(error as Error).message}
            </p>
          )}

          {!isLoading && !isError && coins.length === 0 && (
            <p className="py-16 text-center font-mono text-sm text-muted-foreground">
              Nenhuma moeda encontrada para “{q}”.
            </p>
          )}

          {!isLoading && coins.length > 0 && (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {coins.map((coin) => (
                <CoinCard key={coin.id} coin={coin} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center font-mono text-[11px] text-muted-foreground">
        Dados por CoinGecko · apenas para fins informativos
      </footer>
    </div>
  );
}
