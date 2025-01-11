
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import BookTrainer from "./pages/book-trainer/BookTrainer";

function App() {
  const { isauthenticated } = useAuth();

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            
                <Route path="/book-trainer" element={<BookTrainer/>} />
                
          
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/auth/sign-in" element={<SignIn />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
              
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
