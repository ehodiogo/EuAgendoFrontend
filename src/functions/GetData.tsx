import { useEffect, useState } from "react";

const baseUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/"
    : "https://backend-production-6587.up.railway.app/";
// TODO: TROCAR URL DE PRD 

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  filter?: string;
  slug?: string;
};

export function useFetch<T>(
  endpoint: string,
  id?: number,
  options?: FetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let url = id ? `${baseUrl}${endpoint}/${id}` : `${baseUrl}${endpoint}`;

        if (options?.filter) {
          url = `${url}?filter=${options.filter}`;
        }

        if (options?.slug) {
          url = `${url}?slug=${options.slug}`;
        }

        const fetchOptions: RequestInit = {
          method: options?.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
          },
          body: options?.body ? JSON.stringify(options.body) : undefined,
        };

        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          throw new Error(
            `Erro no endpoint: ${endpoint}. Status: ${response.status}`
          );
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }

    if (loading) {
      fetchData();
    }
  }, [endpoint, id, options, loading]);

  return { data, loading };
}
