import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { addFriend, removeFriend } from '../../actions/users';
import moment from 'moment';
import useRandomColor from '../../hook/useRandomColor';

import EditProfileForm from './EditProfileForm';
import ProfileBio from './ProfileBio';
import Friends from './Friends';
import AlertBox from '../../components/AlertBox'; // Integrated custom application alert feedback node

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [Switch, setSwitch] = useState(false);
  const color = useRandomColor();

  // Dialog / Warning Banner State Machine
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: '',
    title: '',
    variant: 'warning',
    confirmLabel: 'Got it',
    cancelLabel: undefined,
    onConfirm: null
  });

  const users = useSelector((state) => state.usersReducer);
  const currentProfile = users.find((user) => user._id === id);
  const currentUser = useSelector((state) => state.currentUserReducer);

  const currentUserFriends = users.find(
    (user) => user._id === currentUser?.result?._id
  )?.friends;

  const isFriend = Boolean(
    currentUser && currentUserFriends && currentProfile && currentUserFriends.includes(currentProfile._id)
  );

  const handleAddFriend = () => {
    if (!currentUser) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in or register to follow workspace contributors.',
        title: 'Action Required',
        variant: 'warning',
        confirmLabel: 'Go to Login',
        onConfirm: () => navigate('/login')
      });
    } else {
      dispatch(addFriend(id, currentUser?.result?._id));
    }
  };

  const handleRemoveFriend = () => {
    if (!currentUser) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in to adjust your developer connections.',
        title: 'Action Required',
        variant: 'warning',
        confirmLabel: 'Go to Login',
        onConfirm: () => navigate('/login')
      });
    } else {
      setAlertConfig({
        isOpen: true,
        message: `Do you want to sever your network connection with ${currentProfile?.name || 'this contributor'}?`,
        title: 'Disconnect Contributor',
        variant: 'danger',
        confirmLabel: 'Disconnect',
        cancelLabel: 'Cancel',
        onConfirm: () => {
          dispatch(removeFriend(id, currentUser?.result?._id));
        }
      });
    }
  };

  if (!currentProfile) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-theme-bg-main gap-3 select-none">
        <div className="w-6 h-6 rounded-full border-2 border-theme-accent-primary/10 border-t-theme-accent-primary animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-theme-text-dim animate-pulse">
          Locating account parameter nodes...
        </p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.result?._id === id;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-theme-bg-main py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* ================= PROFILE CARD HEADER HERO BANNER ================= */}
        <div className="w-full bg-theme-bg-surface/60 dark:bg-theme-bg-surface/40 backdrop-blur-md border border-theme-border/60 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-theme-accent-primary/[0.01] to-transparent pointer-events-none" />

          {/* Identity Row Hub */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full min-w-0 relative z-10">
            
            {/* Custom Avatar Render Matrix with Pulse Node */}
            <div className="shrink-0 relative group select-none">
              {currentProfile?.profileImage ? (
                <img
                  src={currentProfile.profileImage}
                  alt={currentProfile?.name || 'profile avatar'}
                  className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl shadow-xs object-cover transition-transform duration-300 group-hover:scale-102 border border-theme-border/60"
                />
              ) : (
                <div 
                  style={{ backgroundColor: `#${color || '4f46e5'}` }} 
                  className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl shadow-xs text-white font-black text-3xl flex items-center justify-center transition-transform duration-300 group-hover:scale-102"
                >
                  {currentProfile?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-theme-bg-surface shadow-xs" />
            </div>

            {/* Typography Credentials Stack */}
            <div className="flex flex-col justify-center min-w-0 pt-0.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-theme-text-main truncate">
                  {currentProfile?.name}
                </h1>
                <span className="px-2 py-0.5 self-center text-[9px] font-black uppercase tracking-wider text-theme-accent-primary bg-theme-accent-primary/8 border border-theme-accent-primary/10 rounded-md">
                  {isOwnProfile ? 'Workspace Owner' : 'Contributor'}
                </span>
              </div>
              
              <p className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-theme-text-dim mt-1.5">
                <svg className="w-3.5 h-3.5 text-theme-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {moment(currentProfile?.joinedOn).fromNow()}</span>
              </p>

              {/* Social Connection Graph Buttons */}
              {!isOwnProfile && (
                <div className="mt-4 flex justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={isFriend ? handleRemoveFriend : handleAddFriend}
                    className={`px-4 h-9 inline-flex items-center justify-center rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all border shadow-3xs active:scale-97 ${
                      isFriend
                        ? 'bg-theme-bg-main text-rose-500 border-rose-500/20 hover:bg-rose-500/5'
                        : 'bg-theme-accent-primary text-white border-transparent hover:bg-theme-accent-hover'
                    }`}
                  >
                    {isFriend ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Self Edit Modal Trigger Button */}
          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setSwitch(!Switch)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 h-9 rounded-xl text-xs font-bold text-theme-text-muted bg-theme-bg-element/40 border border-theme-border/50 hover:border-theme-accent-primary/40 hover:text-theme-text-main transition-all cursor-pointer shadow-3xs shrink-0 self-center sm:self-start active:scale-95"
              title="Modify platform profile details"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
          )}
        </div>

        {/* ================= STRUCTURAL GRID CONTENT SPLIT COLUMNS ================= */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] items-start gap-6 w-full">
          {/* Left Column: Developer Bio, Statistics, Records */}
          <div className="w-full min-w-0">
            <ProfileBio currentProfile={currentProfile} users={users} />
          </div>

          {/* Right Column: Connection Networks, Watched Nodes */}
          <div className="w-full shrink-0">
            <Friends currentProfile={currentProfile} users={users} />
          </div>
        </div>

        {/* ================= SYSTEM INTERACTIVE FORMS MODAL SHEET ================= */}
        {Switch && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fade-in"
            onClick={() => setSwitch(false)}
          >
            <div 
              className="w-full max-w-lg bg-theme-bg-surface border border-theme-border rounded-2xl shadow-2xl relative transform transition-all duration-200 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <EditProfileForm currentUser={currentUser} setSwitch={setSwitch} />
            </div>
          </div>
        )}

        {/* ================= APPLICATION NOTIFICATION DIALOG MANAGER ================= */}
        {alertConfig.isOpen && (
          <AlertBox
            message={alertConfig.message}
            title={alertConfig.title}
            variant={alertConfig.variant}
            confirmLabel={alertConfig.confirmLabel}
            cancelLabel={alertConfig.cancelLabel}
            onConfirm={alertConfig.onConfirm}
            onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false, onConfirm: null }))}
          />
        )}

      </div>
    </div>
  );
};

export default UserProfile;
