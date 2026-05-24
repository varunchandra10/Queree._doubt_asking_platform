import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import copy from "copy-to-clipboard";
import { likePost, dislikePost, addComment, deleteComment } from '../../actions/posts';
import { showAppAlert } from '../../utils/appAlert';

const Post = ({ post, profileImage }) => {
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const url = window.location.href + `/${post._id}`;

  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (post?.likes?.includes(User?.result?._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [post?.likes, User]);

  const handleLike = () => {
    if (!User) {
      showAppAlert("Log in or sign up to continue.");
      navigate('/login');
    } else {
      dispatch(likePost(post._id, User?.result?._id))
    }
  };

  const handleDislike = () => {
    if (!User) {
      showAppAlert("Log in or sign up to continue.");
      navigate('/login');
    } else {
      dispatch(dislikePost(post._id, User?.result?._id))
    }
  };

  const handleShare = () => {
    copy(url);
    showAppAlert({
      title: 'Link Copied',
      message: 'The post URL was copied to your clipboard.',
      variant: 'success',
    });
  };

  const handleAddComment = () => {
    if (!User) {
      showAppAlert('Log in or sign up to continue.');
      navigate('/login');
    } else {
      if (!comment.trim()) return;
      dispatch(addComment(post._id, User.result._id, comment, User.result.name));
      setShowCommentModal(false);
      setComment('');
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(post._id, commentId));
  };

  return (
    <div className="w-full bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xs p-5 transition-colors duration-200 mb-6">

      {/* Top Section: Author Metadata info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 select-none shadow-3xs relative bg-theme-bg-element">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${post?.name || 'User'}'s avatar`}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-black text-sm tracking-wide flex items-center justify-center uppercase">
              {post?.name ? post.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        <div>
          <Link to={`/Users/${post?.userId}`} className="text-sm font-bold text-theme-text-main hover:text-theme-accent-primary transition-colors block">
            {post?.name}
          </Link>
          <span className="text-[11px] text-theme-text-dim font-medium uppercase tracking-wider">Community Contributor</span>
        </div>
      </div>

      {/* Description Text block section */}
      <div className="text-sm text-theme-text-muted leading-relaxed mb-4 whitespace-pre-wrap">
        <p>
          {showFullDescription ? post?.desc : `${post?.desc?.slice(0, 140)}${post?.desc?.length > 140 ? '...' : ''}`}
        </p>
        {post?.desc?.length > 140 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs font-bold text-theme-accent-primary hover:text-theme-accent-hover transition-colors mt-1.5 cursor-pointer block"
          >
            {showFullDescription ? 'See Less' : 'See Full Details →'}
          </button>
        )}
      </div>

      {/* Primary Media Asset Container Panel */}
      {((post?.imageUrl && post?.videoUrl === undefined) || post?.videoUrl) && (
        <div className="w-full rounded-xl overflow-hidden border border-theme-border bg-theme-bg-main mb-4 max-h-[450px] flex items-center justify-center">
          {post?.videoUrl === undefined || !post?.videoUrl ? (
            <img src={post?.imageUrl} alt="Shared experience attachment" className="w-full h-full max-h-[450px] object-cover" />
          ) : (
            <video src={post?.videoUrl} controls className="w-full h-full max-h-[450px]" />
          )}
        </div>
      )}

      {/* Interaction Controls Strip Bar */}
      <div className="flex items-center justify-between border-t border-b border-theme-border/60 py-2.5 my-4">
        <div className="flex items-center gap-4">

          {/* Like Action Toggle element button */}
          <button
            onClick={isLiked ? handleDislike : handleLike}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${isLiked ? 'bg-indigo-500/10 text-theme-accent-primary' : 'text-theme-text-muted hover:bg-theme-bg-element hover:text-theme-text-main'
              }`}
          >
            <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.757c1.246 0 2.254 1.008 2.254 2.254 0 .423-.12.839-.345 1.2l-3.321 5.31A3.757 3.757 0 0114.157 20H7v-8l4.232-6.347A1.5 1.5 0 0112.5 5a1.5 1.5 0 011.5 1.5V10z" />
            </svg>
            <span>{post?.likes?.length || 0} Likes</span>
          </button>

          {/* Comment Open Toggle element button */}
          <button
            onClick={() => setShowCommentModal(!showCommentModal)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-text-muted hover:bg-theme-bg-element hover:text-theme-text-main px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post?.comments?.length || 0} Comments</span>
          </button>

          {/* Share execution control button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-text-muted hover:bg-theme-bg-element hover:text-theme-text-main px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>

        </div>
      </div>

      {/* Embedded Input Drawer Box Module for write commentaries */}
      {showCommentModal && (
        <div className="p-4 bg-theme-bg-main border border-theme-border rounded-xl mb-4 animate-fade-in flex flex-col gap-3">
          <textarea
            rows="3"
            placeholder="Contribute your structural answers or feedback to this thread..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-theme-bg-surface border border-theme-border rounded-xl text-sm text-theme-text-main placeholder-theme-text-dim focus:outline-none focus:ring-2 focus:ring-theme-accent-primary"
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              onClick={() => setShowCommentModal(false)}
              className="px-3 py-2 font-semibold text-theme-text-muted hover:bg-theme-bg-element rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              className="px-4 py-2 font-bold text-white bg-theme-accent-primary hover:bg-theme-accent-hover rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Bottom Inline Nested Comments List section container */}
      {post?.comments?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-theme-border/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-dim mb-3">
            Discussion Thread ({post.comments.length})
          </h4>

          <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {post.comments.map((commentItem) => (
              <li key={commentItem.commentId} className="bg-theme-bg-main/50 border border-theme-border/60 rounded-xl p-3 flex gap-3 items-start group/comment">
                <Avatar className="h-7 w-7 bg-theme-bg-element text-theme-text-muted text-xs font-bold shrink-0">
                  {commentItem.name ? commentItem.name.charAt(0).toUpperCase() : '?'}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-theme-text-main">{commentItem.name}</span>

                    {/* Delete capability matches contextual user parameters */}
                    {(commentItem.userId === User?.result?._id || post.userId === User?.result?._id) && (
                      <button
                        onClick={() => handleDeleteComment(commentItem.commentId)}
                        className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer opacity-0 group-hover/comment:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-theme-text-muted mt-1 leading-relaxed">{commentItem.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default Post;
