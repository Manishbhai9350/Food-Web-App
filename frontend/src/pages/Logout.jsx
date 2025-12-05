import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout as UserLogout } from "../redux/slices/User.slice";
import { logout as PartnerLogout } from "../redux/slices/Partner.slice";
import { Axioss } from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        const res = await Axioss.post("/auth/logout",{},{withCredentials:true});

        console.log(res)

        // Clear redux states
        dispatch(UserLogout());
        dispatch(PartnerLogout());

        // Redirect to auth
        // navigate("/auth", { replace: true });
      } catch (err) {
        console.log("Logout error:");
        console.log(err)
        console.log(new Object(err))
        // navigate("/auth", { replace: true });
      }
    };

    doLogout();
  }, [dispatch, navigate]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: 600,
        color: "var(--accent)",
      }}
    >
      Logging out...
    </div>
  );
};

export default Logout;
