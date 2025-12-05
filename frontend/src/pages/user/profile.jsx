import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { useSelector } from "react-redux";
import { Axioss } from "../../utils/axios";
import Reel from "../../components/Reel";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("liked");

  const user = useSelector((state) => state.user);

  const [savedReels, setSavedReels] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [openIndex, setOpenIndex] = useState(null); // universal index

  useEffect(() => {
    const GetData = async () => {
      try {
        const Res = await Axioss.get("/api/user/reels", {
          withCredentials: true,
        });
        const { savedReels, likedReels } = Res.data;
        setSavedReels(savedReels);
        setLikedReels(likedReels);
      } catch (error) {}
    };
    GetData();
  }, []);

  const reelsToShow = activeTab === "liked" ? likedReels : savedReels;

  return (
    <div className="partner-page">
      {/* Header */}
      <div className="partner-header">
        <button onClick={() => navigate(-1)} className="partner-back-btn">
          <IoArrowBack size={24} />
        </button>
        <h1 className="partner-page-title">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="partner-info-card" style={{ marginTop: "20px" }}>
        <div className="partner-avatar">
          {user?.fullname?.charAt(0).toUpperCase()}
        </div>
        <div className="partner-details">
          <h2 className="partner-name">{user?.fullname}</h2>
          <p className="partner-address">📧 {user?.email}</p>
          <div className="partner-stats" style={{ marginTop: "18px" }}>
            <div className="stat-item">
              <span className="stat-value">{likedReels.length}</span>
              <span className="stat-label">Liked</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{savedReels.length}</span>
              <span className="stat-label">Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          onClick={() => setActiveTab("liked")}
          className={`profile-tab ${activeTab === "liked" ? "active" : ""}`}
        >
          ❤️ Liked Reels
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`profile-tab ${activeTab === "saved" ? "active" : ""}`}
        >
          📌 Saved Reels
        </button>
      </div>

      {/* Reels Grid */}
      <div className="partner-reels-section" style={{ marginTop: "10px" }}>
        <h3 className="section-title">
          {activeTab === "liked" ? "Liked Reels" : "Saved Reels"}
        </h3>

        <div className="partner-reels-grid">
          {reelsToShow.map((reel, i) => (
            <div
              key={reel._id}
              className="reel-card"
              onClick={() => setOpenIndex(i)}
              style={{ cursor: "pointer" }}
            >
              <video
                src={reel.video}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  height: "150px",
                  objectFit: "cover",
                }}
                muted
                loop
                preload="metadata"
              />
              <div className="reel-card-info" style={{ marginTop: "6px" }}>
                <h4 className="reel-card-title">{reel.title}</h4>
                <p className="reel-card-description">
                  {reel.description.length > 40
                    ? reel.description.slice(0, 40) + "..."
                    : reel.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!reelsToShow.length && (
        <div
          className="empty-state"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <p>No {activeTab} reels found</p>
        </div>
      )}

      {/* Popup Modal for ReelViewer */}
      {openIndex !== null && (
        <div
          className="reel-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpenIndex(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* Render all reels but only open the selected one */}
            {reelsToShow.map((reel, i) => (
              <Reel key={reel._id} reel={reel} isOpen={i === openIndex} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
