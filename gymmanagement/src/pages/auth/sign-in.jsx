import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';

export function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await api.post('/signin', formData);
      const data = response.data;

      if (data.message === "Login successful") {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user); // Update the user state

        // Show success toast
        toast.success('Successfully signed in!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate to dashboard after successful login
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(data.message || "An error occurred during sign in");
        setError(data.message || "An error occurred during sign in");
      }
    } catch (error) {
      console.error('Error during sign in:', error); // Log the error
      if (error.response) {
        toast.error(error.response.data.message || "Server error occurred");
        setError(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        toast.error("Network error - please check your connection");
        setError("Network error - please check your connection");
      } else {
        toast.error("An unexpected error occurred");
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <ToastContainer />
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Gym Management System</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Please Enter your email and password to Login to the System.</Typography>
          {error && <Typography color="red" className="mt-2">{error}</Typography>}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="lg"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password <span className="text-red-500">*</span>
            </Typography>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required
            />
          </div>
      
          <Button 
            type="submit" 
            className="mt-6" 
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern background"
        />
      </div>

    </section>
  );
}

export default SignIn;
