import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../actions/users';
import { uploadProfileImage } from '../../api';
import { setCurrentUser } from '../../actions/currentUser';
import { showAppAlert } from '../../utils/appAlert';

const EditProfileForm = ({ currentUser, setSwitch }) => {
  const [name, setName] = useState(currentUser?.result?.name || '');
  const [about, setAbout] = useState(currentUser?.result?.about || '');
  
  // Handles tags safely as a raw string while typing to avoid mutation bugs
  const [tagInput, setTagInput] = useState(currentUser?.result?.tags?.join(' ') || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (selectedPreview) {
        URL.revokeObjectURL(selectedPreview);
      }
    };
  }, [selectedPreview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selectedPreview) {
      URL.revokeObjectURL(selectedPreview);
    }

    setSelectedFile(file);
    setSelectedPreview(URL.createObjectURL(file));
    setImageError('');
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !currentUser?.result?._id) return;

    try {
      setUploadingImage(true);
      setImageError('');

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await uploadProfileImage(formData);
      const uploadedImage = response.data?.result?.profileImage;

      if (!uploadedImage) {
        throw new Error('Upload failed');
      }

      try {
        const storedProfile = JSON.parse(localStorage.getItem('Profile') || 'null');
        const nextProfile = storedProfile?.result
          ? {
              ...storedProfile,
              result: {
                ...storedProfile.result,
                profileImage: uploadedImage,
              },
            }
          : { result: response.data?.result };

        localStorage.setItem('Profile', JSON.stringify(nextProfile));
        dispatch(setCurrentUser(nextProfile));
      } catch (storageError) {
        console.error('Failed to sync uploaded profile image to storage', storageError);
      }

      setSelectedFile(null);
      setSelectedPreview('');
      setUploadingImage(false);
      dispatch({ type: 'UPDATE_CURRENT_USER', payload: response.data?.result });
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      setImageError(serverMessage || error?.message || 'Upload failed');
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showAppAlert('Display name cannot be left empty.');
      return;
    }

    // Process the space-separated string into a clean array on submission
    const processedTags = tagInput.trim() ? tagInput.trim().split(/\s+/) : [];
    
    const updatedData = {
      name: name.trim(),
      about: about.trim(),
      tags: processedTags.length === 0 ? currentUser?.result?.tags : processedTags
    };

    dispatch(updateProfile(currentUser?.result?._id, updatedData));
    setSwitch(false);
  };

  // Live parsing helper for tag list arrays
  const previewTags = tagInput.trim() ? tagInput.trim().split(/\s+/) : [];

  return (
    <div className="w-full bg-theme-bg-surface/95 dark:bg-theme-bg-surface/90 backdrop-blur-xl border border-theme-border/60 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 animate-scale-up max-h-[90vh] overflow-y-auto scrollbar-thin select-none">
      
      {/* Form Content Header Section */}
      <div className="pb-3.5 border-b border-theme-border/40 mb-5 relative">
        <h1 className="text-lg font-black text-theme-text-main tracking-tight">
          Modify Profile
        </h1>
        <p className="text-xs font-semibold text-theme-text-dim mt-0.5">
          Update your identity across the platform.
        </p>
      </div>

      {/* Main Structural Form Configuration */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Profile Picture Upload Unit */}
        <div className="flex flex-col gap-3 rounded-xl border border-theme-border/50 bg-theme-bg-main/30 dark:bg-theme-bg-main/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted">
                Profile Avatar
              </label>
              <p className="text-[11px] font-medium text-theme-text-dim mt-0.5">
                PNG, JPG formats accepted.
              </p>
            </div>
            <label className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-bold text-theme-accent-primary bg-theme-accent-primary/5 border border-theme-accent-primary/10 hover:bg-theme-accent-primary hover:text-white transition-all cursor-pointer active:scale-95">
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="flex items-center gap-3.5 bg-theme-bg-surface/50 border border-theme-border/40 rounded-xl p-2.5">
            <div className="h-14 w-14 rounded-xl border border-theme-border/50 bg-theme-bg-surface overflow-hidden flex items-center justify-center shrink-0 shadow-3xs relative group">
              {selectedPreview || currentUser?.result?.profileImage ? (
                <img
                  src={selectedPreview || currentUser?.result?.profileImage}
                  alt="Profile preview node"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-xl">
                  {currentUser?.result?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-bold text-theme-text-main truncate">
                {selectedFile ? selectedFile.name : 'No image selected yet'}
              </p>
              <p className="text-[10px] font-medium text-theme-text-dim mt-0.5">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Pre-upload stage sandbox preview'}
              </p>
            </div>

            {selectedPreview && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="px-3 h-8 rounded-lg text-xs font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover transition-all shadow-3xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                {uploadingImage ? 'Syncing...' : 'Upload'}
              </button>
            )}
          </div>

          {imageError && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 mt-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{imageError}</span>
            </div>
          )}
        </div>
        
        {/* Input 1: Profile Display Name */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="profile-name" className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted">
            Display Name
          </label>
          <input 
            type="text" 
            id="profile-name"
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            maxLength={40}
            className="w-full px-3.5 py-2 bg-theme-bg-main border border-theme-border rounded-xl text-xs font-semibold text-theme-text-main placeholder-theme-text-dim focus:outline-hidden focus:ring-1.5 focus:ring-theme-accent-primary focus:bg-theme-bg-surface transition-all duration-200"
          />
        </div>

        {/* Input 2: About Me Paragraph Box */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="profile-about" className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted">
            Developer Biography
          </label>
          <textarea 
            id="profile-about" 
            rows="4" 
            value={about} 
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Introduce yourself, your technical specializations, or your research fields..."
            className="w-full px-3.5 py-2.5 bg-theme-bg-main border border-theme-border rounded-xl text-xs font-medium text-theme-text-main placeholder-theme-text-dim focus:outline-hidden focus:ring-1.5 focus:ring-theme-accent-primary focus:bg-theme-bg-surface transition-all duration-200 resize-none min-h-[90px] leading-relaxed"
          />
        </div>

        {/* Input 3: Watched Technology Filters */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="profile-tags" className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted">
            Watched Technologies
          </label>
          <input 
            type="text" 
            id="profile-tags"  
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="e.g. reactjs graph-neural-networks nextjs c"
            className="w-full px-3.5 py-2 bg-theme-bg-main border border-theme-border rounded-xl text-xs font-semibold text-theme-text-main placeholder-theme-text-dim focus:outline-hidden focus:ring-1.5 focus:ring-theme-accent-primary focus:bg-theme-bg-surface transition-all duration-200"
          />
          <p className="text-[10px] font-semibold text-theme-text-dim leading-normal px-0.5">
            Separate individual index parameters with exactly one space.
          </p>

          {/* Real-time Dynamic Injected Micro-Tag Preview Tracker */}
          {previewTags.length > 0 && previewTags[0] !== "" && (
            <div className="flex flex-wrap gap-1 pt-1.5">
              {previewTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 text-[10px] font-bold text-theme-accent-primary bg-theme-accent-primary/6 border border-theme-accent-primary/10 rounded-md shadow-3xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button Strip Row Container */}
        <div className="flex items-center gap-2 pt-4 border-t border-theme-border/40 justify-end">
          
          {/* Cancel Close Switch Toggle Form Trigger */}
          <button 
            type="button" 
            onClick={() => setSwitch(false)}
            className="px-3.5 h-9 inline-flex items-center justify-center rounded-xl text-xs font-bold text-theme-text-muted hover:bg-theme-bg-element/60 border border-theme-border/80 transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>

          {/* Core Save Submission Control */}
          <button 
            type="submit" 
            className="px-4 h-9 inline-flex items-center justify-center rounded-xl text-xs font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover transition-all shadow-xs shadow-theme-accent-primary/10 cursor-pointer active:scale-95"
          >
            Save Profile
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditProfileForm;
