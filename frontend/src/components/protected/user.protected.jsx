import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Axioss } from "../../utils/axios";
import { login, logout } from "../../redux/slices/User.slice";

const UserProtected = ({ children }) => {
  const isUserLoggedIn = useSelector((state) => state.user.loggedIn);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Axioss.post("/auth/authorized");
        const { loggedIn, data } = res.data;

        if (loggedIn === "user") {
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

  if (!isUserLoggedIn) {
    return <Navigate to="/auth/user/login" replace />; // your user login route
  }

  return children;
};

export default UserProtected;
