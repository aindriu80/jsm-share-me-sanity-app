import React, { useEffect } from 'react'
import GoogleLogin from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
const clientId = import.meta.env.VITE_GOOGLE_API_TOKEN
import logo from '../assets/logowhite.png'

import { client } from '../client'
import { gapi } from 'gapi-script'

const Login = () => {
  const navigate = useNavigate()
  const onSuccess = (res) => {
    console.log('Login successful! Current user is', res.profileObj)
    console.log('RESPONSE', res)
    // console.log('Res.Obj', res.Obj)
    localStorage.setItem('user', JSON.stringify(res.profileObj))

    const { name, googleId, imageUrl } = res.profileObj

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
  const onFailure = (res) => {
    console.log('Login has failed, res is ', res)
  }
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      })
    }
    gapi.load('client:auth2', start)
  })

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
              clientId={clientId}
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
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
