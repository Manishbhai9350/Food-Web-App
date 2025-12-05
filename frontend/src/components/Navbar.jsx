import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { logout as UserLogout } from "../redux/slices/User.slice";
import { logout as PartnerLogout } from "../redux/slices/Partner.slice";
import { Axioss } from "../utils/axios";
import { useDispatch } from "react-redux";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await Axioss.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );

      // Clear redux states
      dispatch(UserLogout());
      dispatch(PartnerLogout());

      // Redirect to auth
      navigate("/auth", { replace: true });
    } catch (err) {
      navigate("/auth", { replace: true });
    }
  };

  return (
    <nav
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 200,
      }}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 14px",
          background: "var(--accent)",
          border: "none",
          color: "white",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "0.2s",
          fontSize: 20,
        }}
      >
        ☰
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            background: "white",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            width: "150px",
            animation: "fadeIn 0.15s ease",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "none",
              textAlign: "left",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: 20,
            }}
            onClick={() => navigate("/user/profile")}
          >
            👤 Profile
          </button>

          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "none",
              textAlign: "left",
              fontWeight: 500,
              cursor: "pointer",
              color: "var(--accent)",
              borderRadius: "6px",
              marginTop: "4px",
              fontSize: 20,
            }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
