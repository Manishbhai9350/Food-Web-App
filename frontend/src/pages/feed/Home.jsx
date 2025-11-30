import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReelViewer from '../../components/ReelViewer'
import '../../App.css'

const THRESHOLD = 5
const WINDOW = Math.max(2, THRESHOLD * 2)

const dummyReels = [
  { id: 1, title: 'Spicy Biryani', cuisine: 'Hyderabadi', url: 'https://via.placeholder.com/400x800?text=Biryani+1', restaurant: 'Royal Biryani House', rating: 4.8, prepTime: '25-30 min' },
  { id: 2, title: 'Butter Chicken', cuisine: 'North Indian', url: 'https://via.placeholder.com/400x800?text=Butter+Chicken', restaurant: 'Curry Palace', rating: 4.7, prepTime: '20-25 min' },
  { id: 3, title: 'Margherita Pizza', cuisine: 'Italian', url: 'https://via.placeholder.com/400x800?text=Pizza', restaurant: 'Mama Mia', rating: 4.6, prepTime: '15-20 min' },
  { id: 4, title: 'Pad Thai', cuisine: 'Thai', url: 'https://via.placeholder.com/400x800?text=Pad+Thai', restaurant: 'Bangkok Street', rating: 4.9, prepTime: '18-22 min' },
  { id: 5, title: 'Sushi Roll', cuisine: 'Japanese', url: 'https://via.placeholder.com/400x800?text=Sushi', restaurant: 'Tokyo Dreams', rating: 4.8, prepTime: '30-35 min' },
]

const fetchReels = async (offset = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReels = Array.from({ length: 5 }, (_, i) => {
        const id = 6 + offset + i
        return {
          id,
          title: `Delish #${id}`,
          cuisine: 'Mixed',
          url: `https://via.placeholder.com/400x800?text=Reel+${id}`,
          restaurant: ['Street Eats', 'Food Hub', 'Crave Corner', 'Heat Kitchen', 'Farm Fresh'][i],
          rating: (4.4 + Math.random() * 0.5).toFixed(1),
          prepTime: `${15 + Math.random() * 20 | 0} min`
        }
      })
      resolve(newReels)
    }, 600)
  })
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialIndex = parseInt(searchParams.get('reel')) || 0

  const [reels, setReels] = useState(dummyReels)
  const [currentIndex, setCurrentIndex] = useState(clamp(initialIndex, 0, dummyReels.length - 1))
  const [loading, setLoading] = useState(false)

  // sensor/lock refs
  const lockRef = useRef(false)
  const wheelAccumRef = useRef(0)
  const pointerStartRef = useRef(null)
  const containerRef = useRef(null)
  const lastFetchRef = useRef(0)
  const currentIndexRef = useRef(initialIndex)
  const reelsRef = useRef(dummyReels)

  // keep refs in sync
  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    reelsRef.current = reels
  }, [reels])

  // update URL on index change
  useEffect(() => {
    setSearchParams({ reel: currentIndex }, { replace: true })
  }, [currentIndex, setSearchParams])

  // compute visible window
  const startIndex = Math.max(0, currentIndex - THRESHOLD)
  const endIndex = Math.min(reels.length - 1, startIndex + WINDOW - 1)

  const visible = useMemo(() => {
    const items = []
    for (let i = startIndex; i <= endIndex; i++) {
      if (reels[i]) {
        items.push({ ...reels[i], globalIndex: i })
      }
    }
    return items
  }, [startIndex, endIndex, reels])

  // load more reels with debounce
  const loadMoreReels = useCallback(async () => {
    const now = Date.now()
    if (loading || now - lastFetchRef.current < 1200) return

    const shouldFetch = reelsRef.current.length - currentIndexRef.current <= THRESHOLD + 2
    if (!shouldFetch) return

    lastFetchRef.current = now
    setLoading(true)
    try {
      const more = await fetchReels(reelsRef.current.length)
      setReels((prev) => [...prev, ...more])
    } catch (err) {
      console.error('Failed to fetch reels:', err)
    } finally {
      setLoading(false)
    }
  }, [loading])

  // prefetch on initial load if needed
  useEffect(() => {
    if (currentIndex > reels.length - THRESHOLD - 2) {
      loadMoreReels()
    }
  }, [])

  // navigation with lock & prefetch (stable)
  const PAGE_DURATION = 520
  const gotoIndex = useCallback((next) => {
    if (lockRef.current) return
    next = clamp(next, 0, reelsRef.current.length - 1)
    if (next === currentIndexRef.current) return

    lockRef.current = true
    setCurrentIndex(next)

    // prefetch near end
    if (reelsRef.current.length - next <= THRESHOLD + 2) {
      loadMoreReels()
    }

    setTimeout(() => {
      lockRef.current = false
    }, PAGE_DURATION)
  }, [loadMoreReels])

  // wheel sensor (use gotoIndex from callback)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e) => {
      if (lockRef.current) return
      e.preventDefault()
      wheelAccumRef.current += e.deltaY

      const SENS = 100
      if (Math.abs(wheelAccumRef.current) >= SENS) {
        if (wheelAccumRef.current > 0) {
          gotoIndex(currentIndexRef.current + 1)
        } else {
          gotoIndex(currentIndexRef.current - 1)
        }
        wheelAccumRef.current = 0
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
    }
  }, [gotoIndex])

  // pointer / touch swipe sensor
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onPointerDown = (e) => {
      if (lockRef.current) return
      const y = e.clientY ?? (e.touches?.[0]?.clientY) ?? 0
      pointerStartRef.current = { y, dy: 0 }
    }

    const onPointerMove = (e) => {
      if (!pointerStartRef.current || lockRef.current) return
      const y = e.clientY ?? (e.touches?.[0]?.clientY) ?? 0
      pointerStartRef.current.dy = pointerStartRef.current.y - y
    }

    const onPointerUp = () => {
      if (!pointerStartRef.current || lockRef.current) return
      const dy = pointerStartRef.current.dy || 0
      const MIN_SWIPE = 80

      if (dy > MIN_SWIPE) {
        gotoIndex(currentIndexRef.current + 1)
      } else if (dy < -MIN_SWIPE) {
        gotoIndex(currentIndexRef.current - 1)
      }

      pointerStartRef.current = null
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [gotoIndex])

  // keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (lockRef.current || !['ArrowDown', 'ArrowUp', ' '].includes(e.key)) return
      e.preventDefault()

      if (e.key === 'ArrowDown' || e.key === ' ') {
        gotoIndex(currentIndexRef.current + 1)
      } else if (e.key === 'ArrowUp') {
        gotoIndex(currentIndexRef.current - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [gotoIndex])

  return (
    <div className="absolute-reel-root">
      <div ref={containerRef} className="absolute-reel-container">
        {visible.map((item) => {
          const offset = (item.globalIndex - currentIndex) * 100
          return (
            <div
              key={`${item.id}-${item.globalIndex}`}
              className="reel"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: `translate(-50%, ${offset}vh)`,
                width: '100%',
                height: '100vh',
                transition: `transform ${PAGE_DURATION}ms cubic-bezier(.22, .9, .34, 1)`,
                willChange: 'transform',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                backfaceVisibility: 'hidden'
              }}
              data-global-index={item.globalIndex}
            >
              <div style={{ width: 'min(480px, 100%)', height: '100%' }}>
                <ReelViewer reel={item} />
              </div>
            </div>
          )
        })}

        {loading && (
          <div className="reel-loading-indicator">
            Loading more reels...
          </div>
        )}
      </div>

      {/* Debug info */}
      <div style={{
        position: 'fixed',
        top: 12,
        right: 12,
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        zIndex: 999,
        pointerEvents: 'none'
      }}>
        {currentIndex + 1} / {reels.length}
      </div>
    </div>
  )
}

export default Home