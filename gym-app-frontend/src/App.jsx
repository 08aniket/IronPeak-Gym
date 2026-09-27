import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import HomePage from './components/HomePage';
import Login from './components/login';
import MembershipPlans from './components/MembershipPlans';
import Register from './components/register';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import JoinPage from './components/JoinPage';
import PasswordUpdate from './components/password';
import Unauthorized from './components/unauthorized';
import NotFound from './components/notfound';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/plans" element={<MembershipPlans />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/password" element={<PasswordUpdate />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
