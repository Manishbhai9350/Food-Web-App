import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthSelect from "./pages/auth/AuthSelect";
import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import PartnerLogin from "./pages/auth/PartnerLogin";
import PartnerRegister from "./pages/auth/PartnerRegister";

import Home from "./pages/feed/Home";
import FoodPartner from "./pages/partner/FoodPartner";
import CreateFood from "./pages/food/createfood";

import UserProtection from "./components/protected/user.protected";
import PartnerProtection from "./components/protected/partner.protected";
import Logout from "./pages/Logout";
import UserProfile from "./pages/user/profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserProtection>
              <Home />
            </UserProtection>
          }
        />

        <Route path="/food-partner/:id" element={<FoodPartner />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthSelect />} />
        <Route path="/auth/user/login" element={<UserLogin />} />
        <Route path="/auth/user/register" element={<UserRegister />} />
        <Route path="/auth/partner/login" element={<PartnerLogin />} />
        <Route path="/auth/partner/register" element={<PartnerRegister />} />
        <Route path="/logout" element={<Logout />} />

        {/* Partner PROTECTED ROUTE */}
        <Route
          path="/food/create"
          element={
            <PartnerProtection>
              <CreateFood />
            </PartnerProtection>
          }
        />

        {/* USER PROTECTED ROUTE */}
        <Route
          path="/user/profile"
          element={
            <UserProtection>
              <UserProfile />
            </UserProtection>
          }
        />

        {/* Auto redirect for invalid routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
