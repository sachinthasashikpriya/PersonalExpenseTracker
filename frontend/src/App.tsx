import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Expense from './pages/Expense'
import Income from './pages/Income'
import Createbudget from './pages/Createbudget'
import Reminder from './pages/Reminder'
import Profile from './pages/profile'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/expense" element={<Expense />} />
      <Route path="/income" element={<Income />} />
      <Route path="/create-budget" element={<Createbudget />} />
      <Route path="/reminder" element={<Reminder />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
