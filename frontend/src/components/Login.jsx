import React from 'react'
import GoogleLogin from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { client } from '../client'

const Login = () => {
  const navigate = useNavigate()
  const responseGoogle = (response) => {
    console.log('RESPONSE', response)
    console.log('Res.Obj', response.Obj)
    localStorage.setItem('user', JSON.stringify(response.profileObj))

    const { name, googleId, imageUrl } = response.profileObj

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    }
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true })
    })
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="relative w-full h-full ">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="object-cover w-full h-full"
        />

        <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-blend-multiply">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="flex items-center justify-center p-3 rounded-lg outline-none cursor-pointer bg-mainColor"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}>
                  <FcGoogle className="mr-4" />
                  Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
