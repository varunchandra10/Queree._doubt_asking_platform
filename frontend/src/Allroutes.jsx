import React from 'react'

import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/Homepage'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Signup from './pages/Auth/Signup'
import AskQuestion from './pages/AskQuestion/AskQuestion'
import Questions from './pages/Questions/Questions'
import DisplayQuestion from './pages/Questions/DisplayQuestion'
import Tags from './pages/Tags/Tags'
import Users from './pages/Users/Users'
import UserProfile from './pages/UserProfile/UserProfile'
import Chatbot from './pages/Authentication/ChatPage'
import Community from './pages/SocialCommunity/Community'
import CommunityPost from './pages/SocialCommunity/CommunityPost'
import Payment from './components/payment'

const Allroutes = () => {
  const User = useSelector((state) => state.currentUserReducer);

  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path='/Questions' element={ <Questions/>} />
        <Route path='/AskQuestion' element={ <AskQuestion/>} />
        <Route path='/Questions/:id' element={< DisplayQuestion />} />
        <Route path='/Tags' element={<Tags />} />
        <Route path='/Users' element={<Users />} />
        <Route path='/Users/:id' element={<UserProfile />} />

        <Route path='/Chatbot' element={User !== null ? <Chatbot /> :<Login/>} />

        <Route path='/Payment' element={<Payment />} />

        <Route path='/Community' element={User !== null ? <Community />:<Login/>} /> 
        <Route path='/Community/:id' element={<CommunityPost />} />
    </Routes>
  )
}

export default Allroutes