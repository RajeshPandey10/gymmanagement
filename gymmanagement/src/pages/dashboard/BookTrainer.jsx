import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { HiUserCircle, HiClock, HiStar, HiCurrencyRupee, HiX } from 'react-icons/hi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../../components/Loader';

const BookTrainer = () => {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trainersLoading, setTrainersLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data } = await api.get('/trainers');
        setTrainers(data);
      } catch (error) {
        toast.error('Failed to load trainers. Please try again later.');
      } finally {
        setTrainersLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a trainer');
      return;
    }
  
    // Client-side validation
    if (duration < 1 || duration > 8) {
      toast.error('Please enter a valid duration (1-8 hours)');
      return;
    }
  
    try {
      setLoading(true);
      const { data } = await api.post(`/trainers/${selectedTrainer._id}/book`, {
        duration: Number(duration),
        sessionDate: bookingDate.toISOString()
      });
  
      toast.success(
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
          <HiStar className="text-2xl text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">Booking Confirmed!</h3>
            <p className="text-sm text-green-700">
              {data.booking.duration}h session with {data.booking.trainer.name}
            </p>
            <p className="text-sm text-green-700">
              Total: ₹{data.booking.amount}
            </p>
          </div>
        </div>
      );
  
      setSelectedTrainer(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Booking failed. Please try again.';
      toast.error(
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-3">
          <HiX className="text-2xl text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Booking Failed</h3>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };
  if (trainersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <HiUserCircle className="text-blue-600" />
          Professional Trainers
        </h1>
        <p className="mt-4 text-lg text-gray-600">Book your personalized training session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map(trainer => (
          <div key={trainer._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <HiUserCircle className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">{trainer.name}</h2>
                  <p className="text-blue-600 font-medium">{trainer.specialization}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <HiClock className="flex-shrink-0 text-gray-500" />
                  <span>{trainer.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiStar className="text-yellow-400 flex-shrink-0" />
                  <span>{trainer.rating}/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCurrencyRupee className="text-green-500 flex-shrink-0" />
                  <span className="font-semibold">₹{trainer.rate}/hour</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTrainer(trainer)}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-pop-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Book {selectedTrainer.name}
              </h2>
              <button
                onClick={() => setSelectedTrainer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Date & Time
                </label>
                <DatePicker
                  selected={bookingDate}
                  onChange={date => setBookingDate(date)}
                  minDate={new Date()}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  popperClassName="z-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={duration}
                  onChange={e => setDuration(Math.min(8, Math.max(1, e.target.value)))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{selectedTrainer.rate * duration}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors disabled:bg-gray-400"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader size="sm" />
                      Processing...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTrainer;