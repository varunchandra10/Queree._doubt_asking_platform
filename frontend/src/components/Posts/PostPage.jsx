import React from 'react';
import Postdisplay from './Postdisplay';
import AddPost from './AddPost';

const PostSide = () => {
  return (
   /* 
      flex flex-col: Stacks inputs and the posts list vertically
      gap-6: Automatically maintains premium modern spacing between the creation card and feed entries
      w-full min-w-0: Protects the container width inside complex desktop grid partitions
   */
   <div className="w-full flex flex-col gap-6 min-w-0">
       <AddPost />
       <Postdisplay />
   </div>
  )
}

export default PostSide;