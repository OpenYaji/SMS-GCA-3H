import React from 'react';
import Logo from '../../../assets/img/gymnazu.png';
import { useAuth } from '../../../context/AuthContext';

const WelcomeBanner = () => {
  const { user } = useAuth();

  return (
    <div className='bg-[#F3D67D] rounded-2xl p-8 shadow-sm mb-6 relative overflow-hidden'>
      <div className='relative flex items-center justify-between'>
        <div>
          <h3 className='font-medium text-stone-800 mb-2'>
            Welcome back, <span className='font-bold'>{user?.firstName || 'Student'}</span>
          </h3>
          <h1 className='text-4xl font-extrabold text-stone-900 '>
            GYMNAZO CHRISTIAN ACADEMY
          </h1>
          <h1 className='flex justify-end text-4xl font-extrabold text-[#3C2F2F] mb-4'>
            STUDENT PORTAL
          </h1>
          <button className='bg-[#3C2F2F] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all shadow'>
            Learn More
          </button>

        </div>
        <div className='hidden md:block w-32 h-32 bg-white/50 rounded-full flex-shrink-0 flex items-center justify-center ml-8'>
          <img src={Logo} alt='Gymnazo Logo' className='w-30 h-30' />
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;