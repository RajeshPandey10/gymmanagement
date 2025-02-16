import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get('/api/user/transactions');
        setTransactions(data);
      } catch (error) {
        toast.error('Failed to load transactions');
      }
    };

    if (user) fetchTransactions();
  }, [user]);

  const handleRating = async (bookingId, rating) => {
    try {
      await api.post(`/trainer/${bookingId}/rate`, { rating });
      setTransactions(prev => prev.map(t => 
        t._id === bookingId ? { ...t, rating } : t
      ));
      toast.success('Rating submitted successfully');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking History</h1>

        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div key={transaction._id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {transaction.type === 'trainer' 
                        ? `Training with ${transaction.trainer.name}`
                        : `${transaction.workoutType} Session`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        transaction.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">₹{transaction.amount}</p>
                    {transaction.paymentStatus === 'completed' && (
                      <div className="mt-2">
                        {transaction.rating ? (
                          <div className="flex items-center gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <HiStar 
                                key={i} 
                                className={`w-5 h-5 ${i < transaction.rating ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRating(transaction._id, star)}
                                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                              >
                                <HiStar className="w-5 h-5" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No transactions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
