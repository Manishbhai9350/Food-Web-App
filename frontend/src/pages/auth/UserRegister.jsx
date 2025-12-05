import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";
import axios from "axios";
import { Axioss } from "../../utils/axios";
import { useDispatch } from "react-redux";
import { register } from "../../redux/slices/User.slice";

const isEmail = (s) => /\S+@\S+\.\S+/.test(s);
const isValidPassword = (p) => p.length >= 6;
const isValidName = (n) => n.trim().length >= 2;

const UserRegister = () => {
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!isValidName(form.fullname)) {
      toast.error("Name must be at least 2 characters");
      return false;
    }
    if (!isEmail(form.email)) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!isValidPassword(form.password)) {
      toast.error("Password must be at least 6 characters");
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
      console.log(form);
      const res = await Axioss.post(
        "/auth/user/register",
        {
          fullname: form.fullname,
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
        dispatch(
          register({
            email: data.email,
            fullname: data.fullname,
          })
        );
        toast.success(message);
        navigate("/");
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand="Zomish" leftEmoji="🍛🍔🍣">
      <div className="form-header">
        <h2>Create an account</h2>
        <p className="muted">Join and discover local favorites</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Full Name</span>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Your fullname"
            disabled={loading}
            required
          />
        </label>

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
          {loading ? "⏳ Creating account..." : "Create Account"}
        </button>

        <div className="form-foot">
          <Link to="/auth/user/login" className="link">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserRegister;
