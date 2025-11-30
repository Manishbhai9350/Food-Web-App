import React, { useState } from 'react'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BiMessageRounded } from 'react-icons/bi'
import { RiShareForwardLine } from 'react-icons/ri'
import { BsCart3 } from 'react-icons/bs'
import { MdDeliveryDining } from 'react-icons/md'
import '../App.css'

const ReelViewer = ({ reel }) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000))
  const [isLiked, setIsLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  // mock description — replace with reel.description
  const fullDescription = `${reel.title} is an amazing dish prepared with fresh, premium ingredients. Savor the perfect blend of spices and flavors. Order now and get 20% off on your first order! 🎉`
  const maxLength = 35
  const isLong = fullDescription.length > maxLength
  const displayText = expanded ? fullDescription : fullDescription.slice(0, maxLength)

  return (
    <div className="reel-viewer">
      <div className="reel-media">
        <img src={reel.url} alt={reel.title} />
      </div>

      <div className="reel-overlay"></div>

      <div className="reel-content">
        <div className="reel-info">
          <h1 className="reel-title">{reel.title}</h1>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center'}}>
            <span style={{
              background: 'rgba(255, 107, 53, 0.85)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              {reel.cuisine}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              backdropFilter: 'blur(10px)'
            }}>
              <span>⭐ {reel.rating}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 8px',
              borderRadius: '6px',
              backdropFilter: 'blur(10px)'
            }}>
              <MdDeliveryDining size={14} />
              <span>{reel.prepTime}</span>
            </div>
          </div>

          {/* Description with See More / See Less */}
          <div>
            <p style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: '1.4',
              color: 'rgba(255, 255, 255, 0.85)',
              letterSpacing: '0.2px'
            }}>
              {displayText}
              {isLong && !expanded && '...'}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 0',
                  marginTop: '6px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'underline'
                }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 1)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                {expanded ? 'See Less' : 'See More'}
              </button>
            )}
          </div>
        </div>

        <div className="reel-actions">
          <button className={`reel-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike} title="Like">
            {isLiked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
            <div className="action-count">{likes > 999 ? `${(likes / 1000).toFixed(1)}k` : likes}</div>
          </button>

          <button className="reel-action-btn" title="Comment">
            <BiMessageRounded size={24} />
            <div className="action-count">520</div>
          </button>

          <button className="reel-action-btn" title="Share">
            <RiShareForwardLine size={24} />
            <div className="action-count">280</div>
          </button>

          <button className="reel-action-btn" style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.9), rgba(255, 154, 60, 0.8))',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginTop: '8px'
          }} title="Order Now">
            <BsCart3 size={24} />
            <div className="action-label">Order</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReelViewer
