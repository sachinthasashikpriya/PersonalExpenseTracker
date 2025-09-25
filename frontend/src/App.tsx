import { Navigate, Route, Routes } from "react-router-dom";
import Createbudget from "./pages/Createbudget";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Reminder from "./pages/Reminder";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/expense" element={<Expense />} />
        <Route path="/income" element={<Income />} />
        <Route path="/create-budget" element={<Createbudget />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
