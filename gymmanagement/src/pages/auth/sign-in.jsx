// src/pages/auth/sign-in.jsx
import { Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post('/user/signin', formData);
      
      if (!data?.token || !data?.user) {
        throw new Error('Invalid server response');
      }

      // Use the login function from AuthContext
      login(data.user, data.token);

      toast.success('Login successful! Redirecting...', {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate('/dashboard')
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Clear form on authentication errors
      if (error.response?.status === 401) {
        setFormData({ email: "", password: "" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4  bg-teal-500">
      <div className="w-full max-w-md space-y-6 border p-4 shadow-2xl shadow-black rounded-xl bg-blue-gray-100">
        <div className="text-center">
          <Typography variant="h2" className="mb-2">Gym Management</Typography>
          <Typography variant="paragraph" className="text-gray-600">
            Enter your credentials to access your account
          </Typography>
          {error && <Typography color="red" className="mt-2">{error}</Typography>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={!!error}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={!!error}
          />

          <Button 
            type="submit" 
            fullWidth 
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">↻</span>
                Signing in...
              </>
            ) : 'Sign In'}
          </Button>

          <Typography className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/auth/sign-up" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </Typography>
        </form>
        <ToastContainer />
      </div>
    </section>
  );
}

export default SignIn;