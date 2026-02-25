import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import SignIn from "@/pages/SignIn/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import SignUp from "@/pages/SignUp/SignUp";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="favorites" element={
            <ProtectedRoute>
              <></>
            </ProtectedRoute>
          }/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};