import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../actions/posts';
import AlertBox from '../../components/AlertBox'; // Integrated your application's custom alert system
import { uploadPostMedia } from '../../api';
import { Share } from 'lucide-react';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await uploadPostMedia(formData);
  return response.data?.result;
};

const AddPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const User = useSelector((state) => state.currentUserReducer);
  const usersList = useSelector((state) => state.usersReducer) || [];
  
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(''); // 'image' or 'video'
  const [uploading, setUploading] = useState(false);

  // Custom Alertbox Dialog State Manager
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: ''
  });

  const imageRef = useRef();
  const videoRef = useRef();

  // Cross-lookup current user's profile image directly from the live global state pool
  const authenticatedProfile = usersList.find((u) => u._id === User?.result?._id);
  const liveAvatarImage = authenticatedProfile?.profileImage || User?.result?.profileImage;

  const handleImgFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setFileType('image');
    }
  };

  const handleVidFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setFileType('video');
    }
  };

  const clearAttachment = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileType('');
  };

  const handleUpload = () => {
    if (User == null) {
      setAlertConfig({
        isOpen: true,
        message: 'Authentication required. Please log in or register to submit a community post.'
      });
      return;
    }

    if (!desc.trim() && !file) {
      setAlertConfig({
        isOpen: true,
        message: 'Please provide a clear description or append a structural file tracking object before posting.'
      });
      return;
    }

    const currentFile = file;
    const currentFileType = fileType;

    if (currentFile) {
      setUploading(true);

      uploadToCloudinary(currentFile)
        .then((uploadResult) => {
          const mediaUrl = uploadResult?.secure_url;

          if (!mediaUrl) {
            throw new Error('Media upload failed.');
          }

          const data = {
            userId: User?.result?._id,
            name: User?.result?.name,
            desc: desc,
            ...(currentFileType === 'image' ? { imageUrl: mediaUrl } : { videoUrl: mediaUrl })
          };

          dispatch(addPost(data));
          setDesc('');
          clearAttachment();
        })
        .catch((error) => {
          console.error('Cloudinary upload error:', error);
          setAlertConfig({
            isOpen: true,
            message: error.message || 'Failed to map media nodes to the Cloudinary storage pipeline.'
          });
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      const data = {
        userId: User?.result?._id,
        name: User?.result?.name,
        desc: desc,
      };
      dispatch(addPost(data));
      setDesc('');
    }
  };

  return (
    <div className="w-full bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs p-5 transition-colors duration-200 text-left">
      
      {/* Uploading Progress Notification Overlay Banner */}
      {uploading && (
        <div className="mb-4 p-3.5 bg-theme-accent-primary/10 border border-theme-accent-primary/20 rounded-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-theme-accent-primary/20 border-t-theme-accent-primary animate-spin"></div>
          <span className="text-xs font-bold text-theme-accent-primary animate-pulse uppercase tracking-wider">
            Publishing updates to community spaces...
          </span>
        </div>
      )}

      <div className="flex gap-4 items-start">
        
        {/* Unified Profile Avatar Container (Synchronized with users pool) */}
        <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0 select-none shadow-3xs relative bg-theme-bg-element">
          {liveAvatarImage ? (
            <img
              src={liveAvatarImage}
              alt="Active profile avatar token"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-black text-sm tracking-wide flex items-center justify-center uppercase">
              {User?.result?.name ? User.result.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>

        {/* Input Text Form Area Block */}
        <div className="flex-1 min-w-0">
          <textarea
            rows="3"
            placeholder="Share an engineering milestone, ask a structural question, or post team updates... "
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-transparent text-theme-text-main placeholder-theme-text-dim text-sm font-medium resize-none focus:outline-hidden focus:ring-0 leading-relaxed border-0 p-0 pt-1.5"
          />

          {/* Media Attachments Preview Grid Panel Module */}
          {previewUrl && (
            <div className="relative mt-4 border border-theme-border rounded-xl overflow-hidden bg-theme-bg-main max-w-lg shadow-inner group">
              <button 
                type="button"
                onClick={clearAttachment}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-slate-900/60 text-white backdrop-blur-xs hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
                aria-label="Remove media item"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {fileType === 'image' ? (
                <img src={previewUrl} alt="Upload Preview" className="w-full h-auto max-h-72 object-contain mx-auto" />
              ) : (
                <video controls className="w-full h-auto max-h-72 object-contain mx-auto">
                  <source src={previewUrl} type={file?.type || 'video/mp4'} />
                </video>
              )}
            </div>
          )}

          {/* Actions Bar Separator Footer Control Matrix */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-theme-border/60">
            <div className="flex items-center gap-1">
              
              {/* Image Input Selection Action Trigger */}
              <button 
                type="button"
                onClick={() => imageRef.current.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sky-500 hover:bg-sky-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image</span>
              </button>

              {/* Video Input Selection Action Trigger */}
              <button 
                type="button"
                onClick={() => videoRef.current.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Video</span>
              </button>

            </div>

            {/* Hidden native system files input hooks element node points */}
            <div className="hidden">
              <input type="file" accept="image/*" ref={imageRef} onChange={handleImgFileChange} />
              <input type="file" accept="video/*" ref={videoRef} onChange={handleVidFileChange} />
            </div>

            {/* Submit execution control action button */}
            <button 
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide uppercase text-white bg-theme-accent-primary hover:bg-theme-accent-hover rounded-xl shadow-xs shadow-theme-accent-primary/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-97"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Post</span>
            </button>

          </div>
        </div>
      </div>

      {/* Dynamic Workspace Alert Dialog Controller Hook */}
      {alertConfig.isOpen && (
        <AlertBox
          message={alertConfig.message}
          onClose={() => setAlertConfig({ isOpen: false, message: '' })}
        />
      )}

    </div>
  );
};

export default AddPost;