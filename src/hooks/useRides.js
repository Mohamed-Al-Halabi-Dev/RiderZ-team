import { useEffect, useState } from "react";
import api, { PAGE_SIZE } from "../config/api";

export function useRides() {
  const [rides, setRides] = useState([]);
  const [status, setStatus] = useState("loading");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    setRides([]);
    setPage(1);
    setHasMore(true);

    // ✅ صار أسهل: api بدل axios + API_URL
    api
      .get("/api/rides", {
        params: { page: 1, pageSize: PAGE_SIZE },
        signal: ctrl.signal,
      })
      .then((res) => {
        const data = res.data?.data ?? [];
        setRides(data);
        setHasMore(data.length > 0);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        console.error(err);
        setStatus("error");
      });

    return () => ctrl.abort();
  }, [reloadKey]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const next = page + 1;
      api
        .get("/api/rides", {
          params: { page: next, pageSize: PAGE_SIZE },
        })
        .then((res) => {
          const data = res.data?.data ?? [];
          setRides((prev) => [...prev, ...data]);
          setPage(next);
          setHasMore(data.length > 0);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const retry = () => setReloadKey((k) => k + 1);

  return {
    rides,
    status,
    hasMore,
    loadingMore,
    loadMore,
    retry,
  };
}
