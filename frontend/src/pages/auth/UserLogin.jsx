import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import { Axioss } from "../../utils/axios";

const isEmail = (s) => /\S+@\S+\.\S+/.test(s);

const UserLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!isEmail(form.email)) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!form.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const res = await Axioss.post(
        "/auth/user/login",
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data.data;
      const message = res.data.message;

      if (res.data.success) {
        toast.success(message);
        navigate('/')
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand="Zomish" leftEmoji="🍛🍔🍣">
      <div className="form-header">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue ordering</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={loading}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={loading}
            required
          />
        </label>

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "⏳ Signing in..." : "Sign In"}
        </button>

        <div className="form-foot">
          <Link to="/auth/user/register" className="link">
            Create account
          </Link>
          <button
            type="button"
            className="btn ghost"
            onClick={() => toast.error("Feature coming soon")}
            disabled={loading}
          >
            Forgot?
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserLogin;
