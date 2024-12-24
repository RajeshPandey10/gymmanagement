import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export function BookTrainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    notes: ''
  });

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        // In a real app, replace this with actual API call
        const trainerData = {
          id: id,
          name: "John Smith",
          specialization: "Weight Training",
          image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop",
          hourlyRate: 50
        };
        setTrainer(trainerData);
      } catch (error) {
        toast.error("Failed to fetch trainer details");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to book a session");
      navigate('/auth/sign-in');
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual API endpoint
      await api.post('/bookings', {
        trainerId: id,
        userId: user.id,
        ...formData
      });

      toast.success("Booking successful!");
      navigate('/schedule');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book session");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          <CardHeader floated={false} className="h-80">
            <img
              src={trainer.image}
              alt={trainer.name}
              className="w-full h-full object-cover"
            />
          </CardHeader>
          
          <CardBody>
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Book a Session with {trainer.name}
            </Typography>
            <Typography color="gray" className="mb-8">
              Specialization: {trainer.specialization}
            </Typography>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Select Date
                </Typography>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Select Time
                </Typography>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Session Duration
                </Typography>
                <Select
                  name="duration"
                  value={formData.duration}
                  onChange={(value) => handleChange({ target: { name: 'duration', value }})}
                >
                  <Option value="30">30 minutes</Option>
                  <Option value="60">1 hour</Option>
                  <Option value="90">1.5 hours</Option>
                </Select>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Additional Notes
                </Typography>
                <Input
                  type="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific requirements or health conditions..."
                />
              </div>
            </form>
          </CardBody>

          <CardFooter className="pt-0">
            <Button
              onClick={handleSubmit}
              className="bg-[#e2ff3d] text-gray-900 hover:bg-[#c8e235]"
              fullWidth
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default BookTrainer;
