import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import ReelViewer from "../../components/ReelViewer";
import "../../App.css";

const THRESHOLD = 5;
const WINDOW = Math.max(2, THRESHOLD * 2);

// Use provided backend-style data as the initial feed (mapped to frontend shape)
const backendSample = {
  success: true,
  direction: "initial",
  reels: [
    { _id: "692db6642a55f66a4149ab24", title: "Paneer Butter", description: "A restaurant-style favorite, paneer butter masala features tender paneer chunks soaked in a silky tomato-cashew gravy with irresistible buttery richness. This mildly spiced and slightly sweet dish is known for its luxurious texture and vibrant red color.", video: "https://ik.imagekit.io/owby5ky2m/butter-paneer_pYC2KfKlLR.mp4", partner: "692db05660d3cae3d3516161", __v: 0 },
    { _id: "692db6402a55f66a4149ab1f", title: "Paneer Dal", description: "Paneer dal combines the protein punch of lentils with soft paneer cubes to create a nourishing and flavorful dish. Slow-cooked yellow dal provides a smooth and velvety texture, while paneer adds richness and heartiness to every spoonful.", video: "https://ik.imagekit.io/owby5ky2m/paneer-daal_IVdIjeUgR.mp4", partner: "692db05660d3cae3d3516161", __v: 0 },
    { _id: "692db6242a55f66a4149ab1c", title: "Paneer Curry", description: "This rich and flavorful paneer curry brings together soft, melt-in-your-mouth paneer cubes simmered in a tomato-onion base infused with traditional Indian spices. The delicious gravy balances warmth and tanginess with subtle creaminess, making every bite deeply satisfying. Fresh ginger, garlic, and garam masala elevate the aroma, while a touch of kasuri methi adds a comforting, homestyle finish. Best enjoyed with hot roti, naan, or steamed rice for a wholesome and soulful meal.", video: "https://ik.imagekit.io/owby5ky2m/paneer-curry_INNXcZ1Fl.mp4", partner: "692db05660d3cae3d3516161", __v: 0 },
    { _id: "692db5ce2a55f66a4149ab19", title: "Marathi Daal Curry", description: "Marathi Daal Curry made with pure ingredients. Made in home taste. Better Spice. Filled with paneer and butter. Excellent in taste.", video: "https://ik.imagekit.io/owby5ky2m/daal-curry_uMltLZ_wE.mp4", partner: "692db05660d3cae3d3516161", __v: 0 },
    { _id: "692db56d2a55f66a4149ab16", title: "Indian Veg Curry", description: "Indian Vegitarian Curry made with pure water and masalla. Full of Indian handmade food taste and value for money. Good for health 😋", video: "https://ik.imagekit.io/owby5ky2m/veg-curry_2bvaRYSGFl.mp4", partner: "692db05660d3cae3d3516161", __v: 0 }
  ],
  hasMore: true,
};

const dummyReels = backendSample.reels.map((r) => ({
  id: r._id,
  title: r.title,
  description: r.description,
  url: r.video,
  partner: r.partner,
  restaurant: r.restaurant || "",
  rating: r.rating || 4.5,
  prepTime: r.prepTime || "20 min",
}));

// Dummy directional fetch functions that simulate server behavior.
// They mimic the server-side pattern you suggested: fetch previous (older) documents
// by using the current id and returning items with smaller ids, and fetch next
// (newer) items by returning larger ids.
// Return sample MP4s for next reels. Avoid image URLs in video src.
const SAMPLE_VIDEOS = [
  // reuse backend sample links where available, otherwise fall back to a public MP4
  "https://ik.imagekit.io/owby5ky2m/butter-paneer_pYC2KfKlLR.mp4",
  "https://ik.imagekit.io/owby5ky2m/paneer-daal_IVdIjeUgR.mp4",
  "https://ik.imagekit.io/owby5ky2m/paneer-curry_INNXcZ1Fl.mp4",
  "https://ik.imagekit.io/owby5ky2m/daal-curry_uMltLZ_wE.mp4",
  "https://ik.imagekit.io/owby5ky2m/veg-curry_2bvaRYSGFl.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
];

const fetchNextReels = async (offset = 0, limit = THRESHOLD) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = 6 + offset;
      const newReels = Array.from({ length: limit }, (_, i) => {
        const id = start + i;
        return {
          id,
          title: `Delish #${id}`,
          cuisine: "Mixed",
          // pick a sample MP4 (rotate)
          url: SAMPLE_VIDEOS[(i + offset) % SAMPLE_VIDEOS.length],
          restaurant: ["Street Eats", "Food Hub", "Crave Corner", "Heat Kitchen", "Farm Fresh"][i % 5],
          rating: (4.4 + Math.random() * 0.5).toFixed(1),
          prepTime: `${(15 + Math.random() * 20) | 0} min`,
        };
      });
      resolve(newReels);
    }, 600);
  });
};

const fetchPreviousReels = async (currentId = 1, limit = THRESHOLD) => {
  // If currentId is numeric, simulate older numeric ids. If it's a string
  // (e.g. backend _id), don't attempt numeric arithmetic — instead generate
  // synthetic items with unique string ids and MP4 urls so the video element
  // doesn't receive an image URL.
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = [];

      const numeric = Number.isFinite(Number(currentId));
      if (numeric) {
        for (let i = 0; i < limit; i++) {
          const id = Number(currentId) - 1 - i;
          if (id <= 0) break;
          items.push({
            id,
            title: `Older #${id}`,
            cuisine: "Mixed",
            url: SAMPLE_VIDEOS[(i + Number(currentId)) % SAMPLE_VIDEOS.length],
            restaurant: ["Old Eats", "Vintage Deli", "Classic Corner"][i % 3],
            rating: (4.0 + Math.random() * 0.8).toFixed(1),
            prepTime: `${(15 + Math.random() * 20) | 0} min`,
          });
        }
        // items are newest-first (id decreasing), reverse so we prepend older->newer
        resolve(items.reverse());
      } else {
        // currentId is not numeric (likely a string _id) — generate string ids
        for (let i = 0; i < limit; i++) {
          const syntheticId = `prev-${Date.now()}-${i}`;
          items.push({
            id: syntheticId,
            title: `Older ${i + 1}`,
            cuisine: "Mixed",
            url: SAMPLE_VIDEOS[(i + 3) % SAMPLE_VIDEOS.length],
            restaurant: ["Old Eats", "Vintage Deli", "Classic Corner"][i % 3],
            rating: (4.0 + Math.random() * 0.8).toFixed(1),
            prepTime: `${(15 + Math.random() * 20) | 0} min`,
          });
        }
        // Already in older->newer ordering
        resolve(items);
      }
    }, 600);
  });
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialIndex = parseInt(searchParams.get("reel")) || 0;

  const [reels, setReels] = useState(dummyReels);
  const [currentIndex, setCurrentIndex] = useState(
    clamp(initialIndex, 0, dummyReels.length - 1)
  );
  const [loading, setLoading] = useState(false);

  // sensor/lock refs
  const lockRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const pointerStartRef = useRef(null);
  const containerRef = useRef(null);
  const lastFetchRef = useRef(0);
  const currentIndexRef = useRef(initialIndex);
  const reelsRef = useRef(dummyReels);
  const initialPrefetchRef = useRef(false);

  // keep refs in sync
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    reelsRef.current = reels;
  }, [reels]);

  // update URL on index change
  useEffect(() => {
    setSearchParams({ reel: currentIndex }, { replace: true });
  }, [currentIndex, setSearchParams]);

  // compute visible window
  const startIndex = Math.max(0, currentIndex - THRESHOLD);
  const endIndex = Math.min(reels.length - 1, startIndex + WINDOW - 1);

  const visible = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (reels[i]) {
        items.push({ ...reels[i], globalIndex: i });
      }
    }
    return items;
  }, [startIndex, endIndex, reels]);

  // load more reels with debounce and direction support
  // direction: 'next' (append newer) or 'prev' (prepend older)
  const loadMoreReels = useCallback(
    async (direction = "next") => {
      const now = Date.now();
      if (loading || now - lastFetchRef.current < 800) return;

      // Decide whether fetching is necessary depending on direction
      if (direction === "next") {
        const shouldFetch = reelsRef.current.length - currentIndexRef.current <= THRESHOLD + 2;
        if (!shouldFetch) return;
      } else {
        // prev: fetch when currentIndex is small (close to start)
        const shouldFetch = currentIndexRef.current <= THRESHOLD + 1;
        if (!shouldFetch) return;
      }

      lastFetchRef.current = now;
      setLoading(true);
      try {
        if (direction === "next") {
          const more = await fetchNextReels(reelsRef.current.length, THRESHOLD);
          setReels((prev) => [...prev, ...more]);
        } else {
          // fetch older items before the first currently loaded item
          const first = reelsRef.current[0];
          const beforeId = first ? first.id : 1;
          const prevItems = await fetchPreviousReels(beforeId, THRESHOLD);
          if (prevItems.length === 0) return;
          // Prepend and shift currentIndex forward by number prepended to keep same visible
          setReels((prev) => [...prevItems, ...prev]);
          setCurrentIndex((idx) => idx + prevItems.length);
        }
      } catch (err) {
        console.error("Failed to fetch reels:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // prefetch on initial load if needed — run once safely (deps included)
  useEffect(() => {
    if (initialPrefetchRef.current) return;
    initialPrefetchRef.current = true;
    if (currentIndex > reels.length - THRESHOLD - 2) {
      loadMoreReels("next");
    }
  }, [currentIndex, reels.length, loadMoreReels]);

  // navigation with lock & prefetch (stable)
  const PAGE_DURATION = 520;
  const gotoIndex = useCallback(
    (next) => {
      if (lockRef.current) return;
      next = clamp(next, 0, reelsRef.current.length - 1);
      if (next === currentIndexRef.current) return;

      lockRef.current = true;
      setCurrentIndex(next);

      // prefetch near end
      if (reelsRef.current.length - next <= THRESHOLD + 2) {
        loadMoreReels("next");
      }
      // prefetch older when approaching start
      if (next <= THRESHOLD + 1) {
        loadMoreReels("prev");
      }

      setTimeout(() => {
        lockRef.current = false;
      }, PAGE_DURATION);
    },
    [loadMoreReels]
  );

  // wheel sensor (use gotoIndex from callback)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (lockRef.current) return;
      e.preventDefault();
      wheelAccumRef.current += e.deltaY;

      const SENS = 100;
      if (Math.abs(wheelAccumRef.current) >= SENS) {
        if (wheelAccumRef.current > 0) {
          gotoIndex(currentIndexRef.current + 1);
        } else {
          gotoIndex(currentIndexRef.current - 1);
        }
        wheelAccumRef.current = 0;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [gotoIndex]);

  // pointer / touch swipe sensor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e) => {
      if (lockRef.current) return;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      pointerStartRef.current = { y, dy: 0 };
    };

    const onPointerMove = (e) => {
      if (!pointerStartRef.current || lockRef.current) return;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      pointerStartRef.current.dy = pointerStartRef.current.y - y;
    };

    const onPointerUp = () => {
      if (!pointerStartRef.current || lockRef.current) return;
      const dy = pointerStartRef.current.dy || 0;
      const MIN_SWIPE = 80;

      if (dy > MIN_SWIPE) {
        gotoIndex(currentIndexRef.current + 1);
      } else if (dy < -MIN_SWIPE) {
        gotoIndex(currentIndexRef.current - 1);
      }

      pointerStartRef.current = null;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [gotoIndex]);

  // keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (lockRef.current || !["ArrowDown", "ArrowUp", " "].includes(e.key))
        return;
      e.preventDefault();

      if (e.key === "ArrowDown" || e.key === " ") {
        gotoIndex(currentIndexRef.current + 1);
      } else if (e.key === "ArrowUp") {
        gotoIndex(currentIndexRef.current - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gotoIndex]);

  // Handle reel scroll callback
  const handleReelScroll = useCallback((isActive, reelId) => {
    console.log(`Reel ${reelId} is ${isActive ? 'active' : 'inactive'}`);
  }, []);

  return (
    <div className="absolute-reel-root">
      <div ref={containerRef} className="absolute-reel-container">
        {visible.map((item) => {
          const offset = (item.globalIndex - currentIndex) * 100;
          return (
            <div
              key={`${item.id}-${item.globalIndex}`}
              className="reel"
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: `translate(-50%, ${offset}vh)`,
                width: "100%",
                height: "100vh",
                transition: `transform ${PAGE_DURATION}ms cubic-bezier(.22, .9, .34, 1)`,
                willChange: "transform",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 16px",
                backfaceVisibility: "hidden",
              }}
              data-global-index={item.globalIndex}
            >
              <div style={{ width: "min(480px, 100%)", height: "100%" }}>
                <ReelViewer 
                  reel={item} 
                  isActive={item.globalIndex === currentIndex}
                  onReelScroll={handleReelScroll}
                />
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="reel-loading-indicator">Loading more reels...</div>
        )}
      </div>

      {/* Debug info */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "11px",
          zIndex: 999,
          pointerEvents: "none",
        }}
      >
        {currentIndex + 1} / {reels.length}
      </div>
    </div>
  );
};

export default Home;
