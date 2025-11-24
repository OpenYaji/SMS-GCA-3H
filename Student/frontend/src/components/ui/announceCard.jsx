import React from 'react'
import Pic1 from '../../assets/img/pic7.jpg'

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/b9b196/5B3E31?text=Announcement+Image";

const AnnounceCard = ({ title = "Class Suspension", body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc felis ligula.", imageUrl = PLACEHOLDER_IMAGE }) => {
  return (
    <div className="relative flex w-80 flex-col rounded-xl bg-white dark:bg-gray-800 bg-clip-border text-gray-700 dark:text-gray-300 shadow-md dark:shadow-gray-900/50 transition-colors duration-300">
      
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border shadow-lg shadow-blue-gray-500/40 dark:shadow-gray-900/50 bg-[#b9b196] transition-colors duration-300">
        
        <img
          src={Pic1}
          alt={title}
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src=PLACEHOLDER_IMAGE; }} 
        />
        
      </div>
      
      <div className="p-6">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
          {title}
        </h5>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
          {body}
        </p>
      </div>
      <div className="p-6 pt-0">
        <button 
          data-ripple-light="true" 
          type="button" 
          className="select-none rounded-lg bg-[#F4D77D] dark:bg-amber-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-base-brown dark:text-gray-900 shadow-md shadow-blue-500/20 dark:shadow-gray-900/50 transition-all hover:shadow-lg hover:shadow-blue-500/40 dark:hover:shadow-gray-900/70 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none duration-300"
        >
          Read More
        </button>
      </div>
    </div>
  )
}

export default AnnounceCard
