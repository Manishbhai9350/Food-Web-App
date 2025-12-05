import React, { useState, useRef, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsFillSaveFill, BsSave, BsArrowUpRight } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Axioss } from "../utils/axios";

const ReelViewer = ({ reel, isOpen }) => {
  const [likes, setLikes] = useState(reel.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(reel.hasLiked || false);
  const [isSaved, setIsSaved] = useState(reel.hasSaved || false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isOpen) return;

    try {
      v.muted = true;
      v.volume = 0;
      v.play().catch(() => {});
    } catch {}

    return () => {
      try {
        v.pause();
        v.currentTime = 0;
      } catch {}
    };
  }, [isOpen]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await Axioss.patch(
        "/api/food/like",
        { reel: reel._id },
        { withCredentials: true }
      );
      if (res.data?.authorize) {
        navigate("/auth/user/login");
      }
      setLikes(res.data.liked ? likes + 1 : likes - 1);
      setIsLiked(res.data.liked);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await Axioss.patch(
        "/api/food/save",
        { reel: reel._id },
        { withCredentials: true }
      );
      if (res.data?.authorize) {
        navigate("/auth/user/login");
      }
      setIsSaved(res.data.saved);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  const fullDescription = reel.description || "";
  const maxLength = 100;
  const isLong = fullDescription.length > maxLength;
  const displayText = expanded ? fullDescription : fullDescription.slice(0, maxLength);

  if (!isOpen) return null;

  return (
    <div
      className="reel-viewer-modal"
      style={{
        width: "100%",
        background: "#111",
        borderRadius: "12px",
        padding: "16px",
        color: "white",
      }}
    >
      {/* Video */}
      <div className="reel-video" style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}>
        <video
          ref={videoRef}
          src={reel.video}
          style={{ width: "100%", objectFit: "cover" }}
          loop
          muted
          playsInline
          controls
        />
      </div>

      {/* Title & Partner */}
      <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>{reel.title}</h2>
        <Link to={`/food-partner/${reel.partner}`}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(53, 171, 255, 0.85)",
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Visit <BsArrowUpRight size={14} style={{ marginLeft: "4px" }} />
          </span>
        </Link>
      </div>

      {/* Like & Save Buttons */}
      <div style={{ marginTop: "10px", display: "flex", gap: "16px" }}>
        <button
          onClick={handleLike}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "white", cursor: "pointer" }}
        >
          {isLiked ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} />}
          <span>{likes > 999 ? `${(likes / 1000).toFixed(1)}k` : likes}</span>
        </button>

        <button
          onClick={handleSave}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "white", cursor: "pointer" }}
        >
          {isSaved ? <BsFillSaveFill size={24} /> : <BsSave size={24} />}
        </button>
      </div>

      {/* Description */}
      <div style={{ marginTop: "12px", fontSize: "14px", lineHeight: "1.4" }}>
        <p style={{ margin: 0 }}>{displayText}{isLong && !expanded && "..."}</p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "4px",
              textDecoration: "underline",
            }}
          >
            {expanded ? "See Less" : "See More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReelViewer;
