import React, { useState, useEffect } from 'react';
import { Typography, Button, Menu, MenuHandler, MenuList, MenuItem, Avatar, IconButton, Spinner } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [user, setUser ] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Check for user data when component mounts
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser (JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser (null);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const navLinks = [
    { href: "#services", text: "What we offer" },
    { href: "#features", text: "Features" },
    { href: "#pricing", text: "Plans & Pricing" },
    { href: "#faq", text: "FAQs" },
    { href: "#contact", text: "Contact Us" },
  ];

  const userNavLinks = [
    { href: "/dashboard", text: "Dashboard" },
    { href: "/profile", text: "Profile" },
    { href: "/change-password", text: "Change Password" },
  ];

  return (
    <nav className={`fixed top-0 w-full bg-gray-900 shadow-md z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Typography variant="h4" className="font-bold text-[#e2ff3d]">
            GymManagement
          </Typography>

          {/* Mobile menu button */}
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {!user ? (
              navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-white hover:text-[#e2ff3d] transition-colors"
                >
                  {link.text}
                </a>
              ))
            ) : (
              <Menu>
                <MenuHandler>
                  <Button variant="text" className="flex items-center gap-2 text-white hover:bg-gray-800 transition-all">
                    <Avatar 
                      src={`https://ui-avatars.com/api/?name=${user.name}`} 
                      alt="avatar" 
                      size="sm" 
                      className="border-2 border-[#e2ff3d]" 
                    />
                    <span>{user.name.split(" ")[0]}</span> {/* Display first name */}
                  </Button>
                </MenuHandler>
                <MenuList className="bg-gray-800 border border-gray-700">
                  {userNavLinks.map ((link) => (
                    <MenuItem 
                      key={link.href} 
                      className="text-white hover:bg-gray-700 transition-all" 
                      onClick={() => navigate(link.href)}
                    >
                      {link.text}
                    </MenuItem>
                  ))}
                  <MenuItem 
                    className="text-red-500 hover:bg-red-600 hover:text-white font-semibold transition-all flex items-center justify-between border-t border-gray-700 mt-2 pt-2"
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                    {isLoading && <Spinner className="h-4 w-4" />}
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden ${isNavOpen ? "block" : "hidden"} pt-4`}>
          <div className="flex flex-col gap-4">
            {!user ? (
              navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-[#e2ff3d] transition-colors"
                  onClick={() => setIsNavOpen(false)}
                >
                  {link.text}
                </a>
              ))
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="text" className="flex items-center gap-2 text-white justify-start hover:bg-gray-800 transition-all">
                  <Avatar 
                    src={`https://ui-avatars.com/api/?name=${user.name}`} 
                    alt="avatar" 
                    size="sm" 
                    className="border-2 border-[#e2ff3d]" 
                  />
                  <span>{user.name.split(" ")[0]}</span>
                </Button>
                <div className="flex flex-col gap-1">
                  {userNavLinks.map((link) => (
                    <Button 
                      key={link.href} 
                      variant="text" 
                      className="text-white hover:bg-gray-700 justify-start transition-all" 
                      onClick={() => navigate(link.href)}
                    >
                      {link.text}
                    </Button>
                  ))}
                  <Button 
                    variant="text" 
                    className="text-red-500 hover:bg-red-600 hover:text-white font-semibold transition-all flex items-center justify-start border-t border-gray-700 mt-2 pt-2"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <span>Logout</span>
                    {isLoading && <Spinner className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;