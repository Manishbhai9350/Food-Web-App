import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Axioss } from "../../utils/axios";
import { login, logout } from "../../redux/slices/Partner.slice";

const PartnerProtected = ({ children }) => {
  const isPartnerLoggedIn = useSelector((state) => state.partner.loggedIn);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Axioss.post("/auth/authorized");
        const { loggedIn, data } = res.data;

        if (loggedIn === "partner") {
          dispatch(
            login({
              email: data.email,
              fullname: data.fullname,
            })
          );
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) return <>Loading...</>;

  if (!isPartnerLoggedIn) {
    return <Navigate to="/auth/partner/login" replace />;
  }

  return children;
};

export default PartnerProtected;
