import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const navigate = useNavigate()
  const user = fetchUser()

  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  )?.length

  // Is 1 in the array - yes
  // 1, [2,3,1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  // Is 4 in the array - no
  // 4, [2,3,1] -> [0].length -> 0 -> !0 -> true-> !false -> false

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true)

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: user.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload()
          setSavingPost(false)
        })
    }
  }

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg">
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="w-full rounded-lg"
        />
        {postHovered && (
          <div
            className="absolute top-0 z-50 flex flex-col justify-between w-full h-full p-1 pt-2 pb-2 pr-2"
            style={{ height: '100%' }}>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:border-opacity-100 hover:shadow-md">
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved !== 0 ? (
                <button
                  type="button "
                  className="px-5 py-1 text-base font-bold text-white bg-red-500 opacity-70 hover:100 rounded-3xl hover:shadow-md outlined-none">
                  {save?.length}Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    savePin(_id)
                  }}
                  className="px-5 py-1 text-base font-bold text-white bg-red-500 opacity-70 hover:100 rounded-3xl hover:shadow-md outlined-none">
                  Save
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pin
