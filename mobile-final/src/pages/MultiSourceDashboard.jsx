import { useCallback, useEffect, useMemo, useState } from "react";
import externalClient from "../api/externalClient";

const CACHE_KEY = "multi_source_dashboard_cache_v1";

function parseCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache write errors
  }
}

function weatherCodeToLabel(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

function DataCard({ title, status, error, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      {status === "error" && (
        <p className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || "Service currently unavailable"}
        </p>
      )}
      {children}
    </section>
  );
}

export default function MultiSourceDashboard() {
  const [crypto, setCrypto] = useState(null);
  const [weather, setWeather] = useState(null);
  const [cryptoError, setCryptoError] = useState("");
  const [weatherError, setWeatherError] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsSyncing(true);
    setOfflineMode(false);
    setCryptoError("");
    setWeatherError("");

    const cached = parseCache();
    if (cached?.crypto) setCrypto(cached.crypto);
    if (cached?.weather) setWeather(cached.weather);
    if (cached?.updatedAt) setUpdatedAt(cached.updatedAt);

    const requests = await Promise.allSettled([
      externalClient.get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "bitcoin,ethereum",
          vs_currencies: "usd",
        },
      }),
      externalClient.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: 13.7563,
          longitude: 100.5018,
          current: "temperature_2m,weather_code",
        },
      }),
    ]);

    const [cryptoResult, weatherResult] = requests;

    let nextCrypto = cached?.crypto || null;
    let nextWeather = cached?.weather || null;
    let anyFreshSuccess = false;

    if (cryptoResult.status === "fulfilled") {
      const data = cryptoResult.value.data;
      nextCrypto = {
        btcUsd: data?.bitcoin?.usd ?? null,
        ethUsd: data?.ethereum?.usd ?? null,
      };
      setCrypto(nextCrypto);
      anyFreshSuccess = true;
    } else {
      setCryptoError(cryptoResult.reason?.userMessage || "Crypto service unavailable");
    }

    if (weatherResult.status === "fulfilled") {
      const current = weatherResult.value.data?.current;
      nextWeather = {
        tempC: current?.temperature_2m ?? null,
        weatherCode: current?.weather_code ?? null,
      };
      setWeather(nextWeather);
      anyFreshSuccess = true;
    } else {
      setWeatherError(weatherResult.reason?.userMessage || "Weather service unavailable");
    }

    if (anyFreshSuccess) {
      const nowIso = new Date().toISOString();
      const nextCache = {
        crypto: nextCrypto,
        weather: nextWeather,
        updatedAt: nowIso,
      };
      saveCache(nextCache);
      setUpdatedAt(nowIso);
    }

    if (!anyFreshSuccess && (cached?.crypto || cached?.weather)) {
      setOfflineMode(true);
    }

    setIsSyncing(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const updatedLabel = useMemo(() => {
    if (!updatedAt) return "-";
    return new Date(updatedAt).toLocaleString();
  }, [updatedAt]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Real-time Multi-Source Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: {updatedLabel}</p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sync
        </button>
      </div>

      {isSyncing && (
        <div className="fixed right-4 top-4 z-50 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow-lg">
          Loading...
        </div>
      )}

      {offlineMode && (
        <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
          Offline Mode: Showing Cached data
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <DataCard title="Crypto Prices" status={cryptoError ? "error" : "ok"} error={cryptoError}>
          <div className="mt-4 space-y-2 text-sm">
            <p>Bitcoin (BTC): {crypto?.btcUsd != null ? `$${crypto.btcUsd}` : "-"}</p>
            <p>Ethereum (ETH): {crypto?.ethUsd != null ? `$${crypto.ethUsd}` : "-"}</p>
          </div>
        </DataCard>

        <DataCard title="Weather (Bangkok)" status={weatherError ? "error" : "ok"} error={weatherError}>
          <div className="mt-4 space-y-2 text-sm">
            <p>Temperature: {weather?.tempC != null ? `${weather.tempC} C` : "-"}</p>
            <p>Condition: {weather?.weatherCode != null ? weatherCodeToLabel(weather.weatherCode) : "-"}</p>
          </div>
        </DataCard>
      </div>
    </main>
  );
}