"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TokenNews {
  id: string;
  title: string;
  description: string;
}
interface CoinMarketData {
  id: string;
  name: string;
  current_price: number;
  market_cap_rank: number;
}

export default function NewsSummary() {
  const [news, setNews] = useState<TokenNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data: CoinMarketData[] = await res.json();
      const mapped = data.map((item) => ({
        id: item.id,
        title: item.name,
        description: `Current price: $${item.current_price} (${item.market_cap_rank} market cap rank)`,
      }));
      setNews(mapped);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Latest Token News</CardTitle>
        <CardDescription>Summarized information about top tokens.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && news.length === 0 && <p>No news available.</p>}
        <ul className="space-y-2">
          {news.map((item) => (
            <li key={item.id} className="border rounded p-2">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
        <Button variant="outline" onClick={fetchNews} className="mt-4">
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
}
