import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import BookTrainer from './pages/book-trainer/BookTrainer';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/book-trainer/:id" element={<BookTrainer />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
