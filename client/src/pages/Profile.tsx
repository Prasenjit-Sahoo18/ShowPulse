import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { authApi } from '../services/api.js';
import { Button } from '../components/common/Button.js';
import { User, Lock, Phone, Mail, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg('');
    try {
      const updated = await authApi.updateProfile({ name, phone });
      updateUser({ ...user!, name: updated.name, phone: updated.phone });
      setProfileMsg('Profile updated successfully!');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Account & Profile</h1>
          <p className="text-xs text-slate-400">Manage your contact information and security settings.</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<LogOut className="w-4 h-4 text-rose-400" />}
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
        >
          Sign Out
        </Button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-violet-600/30">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email}</span>
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>{user?.phone || 'No phone number provided'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Profile Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            <span>Edit Profile Details</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                placeholder="+91 98765 43210"
              />
            </div>

            {profileMsg && (
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profileMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isUpdatingProfile}
              className="w-full"
            >
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-violet-400" />
            <span>Change Password</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                minLength={6}
                required
              />
            </div>

            {passwordMsg && (
              <div className="text-xs font-semibold text-emerald-400">{passwordMsg}</div>
            )}
            {passwordError && (
              <div className="text-xs font-semibold text-rose-400">{passwordError}</div>
            )}

            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isChangingPassword}
              className="w-full"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
