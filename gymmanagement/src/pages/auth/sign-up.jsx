import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, Suspense } from "react";
import { api } from "../../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "", // Changed from profileName to name to match backend
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill all required fields");
      toast.error("Please fill all required fields", {
        position: "top-top"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        position: "top-top"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name // Using name directly now
      });

      if (response.data) {
        console.log('Signup successful:', response.data);
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          navigate("/auth/sign-in");
        }, 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        console.error('API Error:', err.response.data);
        const errorMessage = err.response.data.message || "Registration failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-top"
        });
      } else if (err.request) {
        const errorMessage = "Network error. Please check your connection.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-top"
        });
      } else {
        const errorMessage = "An unexpected error occurred. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-top"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="m-8 flex">
        <ToastContainer />
        <div className="w-2/5 h-full hidden lg:block">
          <img
            src="/img/pattern.png"
            className="h-full w-full object-cover rounded-3xl"
            loading="lazy"
          />
        </div>
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Become our Member</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Please fill in your details to register.</Typography>
            {error && (
              <Typography variant="small" color="red" className="mt-2">
                {error}
              </Typography>
            )}
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Name
              </Typography>
              <Input
                size="lg"
                name="name"
                placeholder="John Doe"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your email
              </Typography>
              <Input
                size="lg"
                type="email"
                name="email"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Password
              </Typography>
              <Input
                type="password"
                name="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Confirm Password
              </Typography>
              <Input
                type="password"
                name="confirmPassword"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
           
            <Button type="submit" className="mt-6" fullWidth disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                "Register Now"
              )}
            </Button>

            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
            </Typography>
          </form>

        </div>
      </section>
    </Suspense>
  );
}

export default SignUp;
