import React, { useState, useEffect } from 'react'
import { Typography, Button, Menu, MenuHandler, MenuList, MenuItem, Avatar, IconButton, Spinner } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Check for user data when component mounts
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Simulate logout delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Clear all auth data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
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
  ]

  const trainerNavLinks = [
    { href: "/trainer/dashboard", text: "Dashboard" },
    { href: "/trainer/schedule", text: "My Schedule" },
    { href: "/trainer/clients", text: "My Clients" },
    { href: "/trainer/sessions", text: "Training Sessions" },
  ]

  // Random avatar URLs
  const avatarUrls = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/1.jpg", 
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg"
  ]

  // Get random avatar URL
  const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)]

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
            {user?.role === 'trainer' ? (
              trainerNavLinks.map((link) => (
                <Link 
                  key={link.href}
                  to={link.href} 
                  className="text-white hover:text-[#e2ff3d] transition-colors"
                >
                  {link.text}
                </Link>
              ))
            ) : (
              navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-white hover:text-[#e2ff3d] transition-colors"
                >
                  {link.text}
                </a>
              ))
            )}
            
            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/auth/sign-in">
                  <Button className="bg-[#e2ff3d] text-gray-900 hover:bg-[#c8e235] shadow-lg hover:shadow-xl transition-all">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button className="bg-[#e2ff3d] text-gray-900 hover:bg-[#c8e235] shadow-lg hover:shadow-xl transition-all">
                    Sign up for free
                  </Button>
                </Link>
              </div>
            ) : (
              <Menu>
                <MenuHandler>
                  <Button variant="text" className="flex items-center gap-2 text-white hover:bg-gray-800 transition-all">
                    <Avatar src={randomAvatar} alt="avatar" size="sm" className="border-2 border-[#e2ff3d]" />
                    <span>{user.name}</span>
                  </Button>
                </MenuHandler>
                <MenuList className="bg-gray-800 border border-gray-700">
                  {user.role === 'trainer' ? (
                    <>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/trainer/profile')}>
                        Profile
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/trainer/earnings')}>
                        My Earnings
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/trainer/schedule')}>
                        Schedule
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/trainer/clients')}>
                        Clients
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/profile')}>
                        Profile
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/transactions')}>
                        View Transactions
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/schedule')}>
                        Schedule
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/book-gym')}>
                        Book Gym
                      </MenuItem>
                      <MenuItem className="text-white hover:bg-gray-700 transition-all" onClick={() => navigate('/book-trainer')}>
                        Book Trainer
                      </MenuItem>
                    </>
                  )}
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
            {user?.role === 'trainer' ? (
              trainerNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-white hover:text-[#e2ff3d] transition-colors"
                  onClick={() => setIsNavOpen(false)}
                >
                  {link.text}
                </Link>
              ))
            ) : (
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
            )}
            
            {!user ? (
              <div className="flex flex-col gap-4">
                <Link to="/">
                  <Button fullWidth className="bg-[#e2ff3d] text-gray-900 hover:bg-[#c8e235] shadow-lg hover:shadow-xl transition-all">
                    Login
                  </Button>
                </Link>
                <Link to="/">
                  <Button fullWidth className="bg-[#e2ff3d] text-gray-900 hover:bg-[#c8e235] shadow-lg hover:shadow-xl transition-all">
                    Sign up for free
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="text" className="flex items-center gap-2 text-white justify-start hover:bg-gray-800 transition-all">
                  <Avatar src={randomAvatar} alt="avatar" size="sm" className="border-2 border-[#e2ff3d]" />
                  <span>{user.name}</span>
                </Button>
                <div className="flex flex-col gap-1">
                  {user.role === 'trainer' ? (
                    <>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/trainer/profile')}>
                        Profile
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/trainer/earnings')}>
                        My Earnings
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/trainer/schedule')}>
                        Schedule
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/trainer/clients')}>
                        Clients
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/profile')}>
                        Profile
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/transactions')}>
                        View Transactions
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/schedule')}>
                        Schedule
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/book-gym')}>
                        Book Gym
                      </Button>
                      <Button variant="text" className="text-white hover:bg-gray-700 justify-start transition-all" onClick={() => navigate('/book-trainer')}>
                        Book Trainer
                      </Button>
                    </>
                  )}
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
  )
}

export default Navbar