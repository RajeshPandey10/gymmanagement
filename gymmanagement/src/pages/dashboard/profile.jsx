import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HiUserCircle, HiMail, HiPhone, HiLockClosed, HiTrash } from 'react-icons/hi';
import { Dialog } from '@headlessui/react';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Inline Loader Component
  const Loader = ({ size = 'medium' }) => {
    const loaderSize = {
      small: 'h-5 w-5 border-2',
      medium: 'h-8 w-8 border-4',
      large: 'h-12 w-12 border-4'
    }[size];

    return (
      <div className={`animate-spin rounded-full ${loaderSize} border-solid border-current border-r-transparent`}>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/user/me');
        setUserData({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChangePhoneNumber = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/update-phone', { phone: userData.phoneNumber });
      setSuccess('Phone number updated!');
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/user/delete-account/${authUser.id}`);
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      setError('Failed to delete account');
    }
  };

  

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api.put('/user/change-password', { password: newPassword });
      setSuccess('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      setTimeout(() => setError(''), 3000);
    }
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="medium" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <HiUserCircle className="text-blue-600 text-4xl" />
            Profile Settings
          </h1>
        </header>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
            {success}
          </div>
        )}

        {/* Personal Information Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <HiUserCircle className="text-gray-500" />
            Personal Information
          </h2>
          
          <form onSubmit={handleChangePhoneNumber} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={userData.username}
                readOnly
                className="w-full p-2.5 border rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center gap-3">
                <HiMail className="text-gray-500 shrink-0" />
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full p-2.5 border rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="flex items-center gap-3">
                <HiPhone className="text-gray-500 shrink-0" />
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Password Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <HiLockClosed className="text-gray-500" />
            Change Password
          </h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="flex items-center gap-3">
                <HiLockClosed className="text-gray-500 shrink-0" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 6 characters"
                  minLength="6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="flex items-center gap-3">
                <HiLockClosed className="text-gray-500 shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
            <HiTrash className="text-red-600" />
            Danger Zone
          </h2>
          
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full bg-red-50 text-red-700 py-2.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete Account Permanently
          </button>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-[95%]">
          <Dialog.Title className="text-2xl font-bold mb-3 flex items-center gap-2">
            <HiTrash className="text-red-600" />
            Confirm Account Deletion
          </Dialog.Title>
          
          <p className="mb-5 text-gray-600">
            This will permanently delete your account and all associated data. 
            This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2"
            >
              {isDeleting ? <Loader size="small" /> : 'Delete Account'}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default Profile;
