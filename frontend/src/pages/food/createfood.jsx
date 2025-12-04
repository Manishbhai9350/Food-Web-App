import React, { useState } from "react";
import toast from "react-hot-toast";
import { Axioss } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../auth/AuthLayout";

const CreateFood = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    video: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "video") {
      setForm({ ...form, video: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!form.title) return toast.error("Title is required");
    if (!form.description) return toast.error("Description is required");
    if (!form.video) return toast.error("Food video is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("video", form.video);

      const res = await Axioss.post("/api/food/create", fd, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.authorize) {
        return navigate("/auth/partner/login");
      }
      toast.success("Food item created!");
    } catch (err) {
      console.log(err);
      if (err.response.data.authorize) {
        console.log('navigating to partner login')
        return navigate("/auth/partner/login");
      }
      toast.error(err.response?.data?.message || "Failed to create food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand="Zomish" leftEmoji="🥘🍱">
      <div className="form-header">
        <h2>Create Food Item</h2>
        <p className="muted">Add a new dish with a video</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Paneer Curry"
            disabled={loading}
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Rich tomato-based paneer curry..."
            disabled={loading}
            required
            rows={4}
          />
        </label>

        <label className="field">
          <span>Food Video</span>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
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
          {loading ? "⏳ Uploading..." : "Create Food"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default CreateFood;
