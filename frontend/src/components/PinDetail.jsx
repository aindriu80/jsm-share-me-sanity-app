import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0])

        if (data[0]) {
          const query = pinDetailMorePinQuery(data[0])

          client.fetch(query).then((res) => setPins(res))
        }
      })
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if (!pinDetail) return <Spinner message="Loading pin.." />

  return (
    <div
      className="flex m-auto bg-white xl-flex-row flx-col"
      style={{ maxWidth: '1500px', borderRadius: '32px' }}>
      <div className="flex items-center justify-center flex-initial md:items-start">
        <img
          src={pinDetail?.image && urlFor(pinDetail.image).url()}
          className="rounded-b-lg rounded-t-3xl"
          alt="user-post"
        />
      </div>
      <div className="flex-1 w-full p-5 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href={`${pinDetail?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:border-opacity-100 hover:shadow-md">
              <MdDownloadForOffline />
            </a>
          </div>
          <a href={pinDetail.destination} target="_blank" rel="noreferrer">
            {pinDetail.destination}
          </a>
        </div>
        <div>
          <h1 className="mt-3 text-4xl font-bold break-words">
            {pinDetail.title}
          </h1>
          <p className="mt-3">{pinDetail.postedBy?.about}</p>
        </div>
        <Link
          to={`/user-profile/${pinDetail.postedBy?._id}`}
          className="flex items-center gap-2 mt-2">
          <img
            className="object-cover w-8 h-8 rounded-full"
            src={pinDetail.postedBy?.image}
            alt="user-profile"
          />
          <p className="font-semibold capitalize">
            {pinDetail.postedBy?.userName}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default PinDetail
