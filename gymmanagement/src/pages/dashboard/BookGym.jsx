import React, { useState, useEffect } from 'react';
import KhaltiCheckout from "khalti-checkout-web";
import { GiGymBag, GiRunningShoe, GiWeightLiftingUp, GiMuscleUp } from 'react-icons/gi';
import { FaClock, FaMoneyBillWave, FaRegCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../../services/api'; // Import your API service

const BookGym = () => {
  const [workoutType, setWorkoutType] = useState('exercise');
  const [duration, setDuration] = useState(1);
  const [price, setPrice] = useState(100);
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState(null);

  // Initialize Khalti
  useEffect(() => {
    const config = {
      publicKey: 'test_public_key_demo',
      productIdentity: 'gym_booking',
      productName: 'Gym Session',
      productUrl: window.location.href,
 };
    setCheckout(new KhaltiCheckout(config));
  }, []);

  useEffect(() => {
    setPrice(workoutType === 'cardio' ? duration * 250 : duration * 100);
  }, [workoutType, duration]);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await api.post('/bookings/gym', {
        type: 'gym',
        workoutType,
        duration,
        sessionDate: new Date(), // Replace with actual session date
        payment: {
          method: 'khalti',
          transactionId: 'dummy_transaction_id' // Replace with actual transaction ID
        }
      });

      toast.success(
        <div className="p-4">
          <div className="flex items-center gap-3">
            <FaRegCheckCircle className="text-3xl text-green-500" />
            <div>
              <h3 className="text-lg font-bold">Booking Confirmed!</h3>
              <p className="text-sm">{duration}hr {workoutType} session • ₹{response.data.booking.amount}</p>
            </div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            borderRadius: '16px',
            border: '2px solid #bbf7d0'
          }
        }
      );
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-4">
              <GiGymBag className="text-4xl text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Premium Gym Booking</h1>
                <p className="text-blue-100">Select your workout and duration</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <GiRunningShoe className="text-blue-500" />
                Choose Workout Type
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setWorkoutType('exercise')}
                  className={`p-4 rounded-xl transition-all ${
                    workoutType === 'exercise' 
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GiWeightLiftingUp className={`text-2xl ${
                      workoutType === 'exercise' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div className="text-left">
                      <h3 className="font-semibold">Strength Training</h3>
                      <p className="text-sm text-gray-600">₹100/hour</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setWorkoutType('cardio')}
                  className={`p-4 rounded-xl transition-all ${
                    workoutType === 'cardio' 
                    ? 'bg-purple-50 border-2 border-purple-300 shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GiRunningShoe className={`text-2xl ${
                      workoutType === 'cardio' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                    <div className="text-left">
                      <h3 className="font-semibold">Cardio Zone</h3>
                      <p className="text-sm text-gray-600">₹250/hour</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <FaClock className="text-blue-500" />
                Select Duration
              </h2>
              
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setDuration(hours)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      duration === hours
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <FaMoneyBillWave className="text-3xl text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">₹{price}</p>
                  </div>
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all w-full md:w-auto ${
                    loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">↻</span>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
                    Test Mode
                  </span>{' '}
                  No real payment required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default BookGym;