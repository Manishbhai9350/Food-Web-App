import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import '../../App.css'

// mock partner data
const mockPartners = {
  1: {
    id: 1,
    name: 'Royal Biryani House',
    address: '123 Old City, Hyderabad, India',
    phone: '+91 9876543210',
    meals: 45230,
    customers: 12500,
    followers: 8900,
    rating: 4.8,
    reels: [
      { id: 1, title: 'Spicy Biryani', cuisine: 'Hyderabadi', url: 'https://via.placeholder.com/400x800?text=Biryani+1', rating: 4.8, prepTime: '25-30 min' },
      { id: 2, title: 'Butter Chicken', cuisine: 'North Indian', url: 'https://via.placeholder.com/400x800?text=Butter+Chicken', rating: 4.7, prepTime: '20-25 min' },
      { id: 3, title: 'Biryani Combo', cuisine: 'Hyderabadi', url: 'https://via.placeholder.com/400x800?text=Combo', rating: 4.9, prepTime: '30-35 min' },
      { id: 4, title: 'Pulao', cuisine: 'Hyderabadi', url: 'https://via.placeholder.com/400x800?text=Pulao', rating: 4.6, prepTime: '22-28 min' },
      { id: 5, title: 'Haleem', cuisine: 'Hyderabadi', url: 'https://via.placeholder.com/400x800?text=Haleem', rating: 4.7, prepTime: '25-30 min' },
    ]
  },
  2: {
    id: 2,
    name: 'Curry Palace',
    address: '456 MG Road, Bangalore, India',
    phone: '+91 9876543211',
    meals: 38900,
    customers: 9800,
    followers: 7200,
    rating: 4.7,
    reels: [
      { id: 6, title: 'Butter Chicken', cuisine: 'North Indian', url: 'https://via.placeholder.com/400x800?text=BC1', rating: 4.7, prepTime: '20-25 min' },
      { id: 7, title: 'Paneer Tikka', cuisine: 'North Indian', url: 'https://via.placeholder.com/400x800?text=PT', rating: 4.8, prepTime: '18-22 min' },
    ]
  }
}

const FoodPartner = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(false)
  const [liked, setLiked] = useState({})

  const partner = mockPartners[id] || mockPartners[1]

  const handleBack = () => navigate(-1)
  const handleFollow = () => setIsFollowing(!isFollowing)
  const toggleLike = (reelId) => {
    setLiked((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }))
  }

  return (
    <div className="partner-page">
      {/* Header */}
      <div className="partner-header">
        <button onClick={handleBack} className="partner-back-btn">
          <IoArrowBack size={24} />
        </button>
        <h1 className="partner-page-title">{partner.name}</h1>
      </div>

      {/* Partner Info Card */}
      <div className="partner-info-card">
        <div className="partner-avatar">
          {partner.name.charAt(0).toUpperCase()}
        </div>

        <div className="partner-details">
          <h2 className="partner-name">{partner.name}</h2>
          <p className="partner-address">📍 {partner.address}</p>
          <p className="partner-phone">📞 {partner.phone}</p>

          <div className="partner-stats">
            <div className="stat-item">
              <span className="stat-value">{(partner.meals / 1000).toFixed(1)}k</span>
              <span className="stat-label">Meals</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{(partner.customers / 1000).toFixed(1)}k</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{(partner.followers / 1000).toFixed(1)}k</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">⭐ {partner.rating}</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>

          <button 
            onClick={handleFollow}
            className={`partner-follow-btn ${isFollowing ? 'following' : ''}`}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
        </div>
      </div>

      {/* Reels Grid */}
      <div className="partner-reels-section">
        <h3 className="section-title">Food & Specials</h3>
        <div className="partner-reels-grid">
          {partner.reels.map((reel) => (
            <div key={reel.id} className="reel-card">
              <div className="reel-card-image">
                <img src={reel.url} alt={reel.title} />
                <div className="reel-card-overlay">
                  <button 
                    className={`reel-card-like-btn ${liked[reel.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(reel.id)}
                  >
                    {liked[reel.id] ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                  </button>
                </div>
              </div>

              <div className="reel-card-info">
                <h4 className="reel-card-title">{reel.title}</h4>
                <p className="reel-card-cuisine">{reel.cuisine}</p>
                <div className="reel-card-meta">
                  <span>⭐ {reel.rating}</span>
                  <span>🕐 {reel.prepTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!partner.reels.length && (
        <div className="empty-state">
          <p>No reels available yet</p>
        </div>
      )}
    </div>
  )
}

export default FoodPartner