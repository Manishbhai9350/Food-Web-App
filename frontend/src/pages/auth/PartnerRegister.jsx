import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import toast from 'react-hot-toast'
import { Axioss } from '../../utils/axios'

const isEmail = (s) => /\S+@\S+\.\S+/.test(s)
const isValidPassword = (p) => p.length >= 6
const isValidName = (n) => n.trim().length >= 2

const PartnerRegister = () => {
   const [form, setForm] = useState({ fullname: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })



  const validateForm = () => {
    if (!isValidName(form.fullname)) {
      toast.error('Name must be at least 2 characters')
      return false
    }
    if (!isEmail(form.email)) {
      toast.error('Enter a valid email address')
      return false
    }
    if (!isValidPassword(form.password)) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      
      const res = await Axioss.post('/auth/foodpartner/register',{
        fullname:form.fullname,
        email:form.email,
        password:form.password
      },{
        withCredentials:true
      })

      const data = res.data.data;
      const message = res.data.message;


      if(res.data.success) {
        toast.success(message)
        navigate('/')
      }

    } catch (err) {
      console.log(err.response.data.message)
      toast.error(err.response.data.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout brand="Zomish Partners" leftEmoji="👨‍🍳🏬">
      <div className="form-header">
        <h2>Create partner account</h2>
        <p className="muted">Register your outlet and start receiving orders</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Owner / Manager Name</span>
          <input name="fullname" value={form.name} onChange={handleChange} placeholder="Full name" required />
        </label>

        <label className="field">
          <span>Outlet Name</span>
          <input name="outlet" value={form.outlet} onChange={handleChange} placeholder="Outlet name" required />
        </label>

        <label className="field">
          <span>Business Email</span>
          <input name="email" value={form.email} onChange={handleChange} placeholder="business@outlet.com" required />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
        </label>

        <button type="submit" className="btn primary">Create Account</button>

        <div className="form-foot">
          <Link to="/auth/partner/login" className="link">Already have an account? Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default PartnerRegister