import React from 'react';
import Logo from '../../../assets/img/gymnazu.png'; 

const Contact = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! (In a real app, you would send this data to a server)');
  };

  return (
    <div className='w-full p-4 md:p-0 h-full'> 
      <div className='max-w-xl mx-auto'>
        
        <div className='flex justify-center'>
          <div className='w-full p-0.5 rounded-xl shadow-2xl 
            bg-gradient-to-br from-[#5B3E31]/50 dark:from-amber-400/50 via-transparent to-[#5B3E31]/50 dark:to-amber-400/50'>
            
            <div className='flex flex-col md:flex-row rounded-[calc(0.75rem-1px)] overflow-hidden bg-white dark:bg-[#343a40] transition-colors duration-300'>
              
              <div className='w-full md:w-4/12 p-6 flex flex-col justify-center items-center 
                  bg-[#F4D77D] dark:bg-amber-400 text-[#5B3E31] dark:text-gray-900 transition-colors duration-300'> 
                <div className='w-24 h-24'>
                  <img 
                    src={Logo} 
                    alt='Gymnazo Logo' 
                    className='w-full h-full object-contain' 
                  />
                </div>
                <div className='text-center mt-3 text-sm font-semibold text-[#5B3E31] dark:text-gray-900'>
                  Reach out to us!
                </div>
              </div>

              <div className='w-full md:w-8/12 p-6 bg-gray-100 dark:bg-[#212529] transition-colors duration-300'> 
                <h3 className='text-xl font-bold mb-6 text-gray-800 dark:text-amber-400 '>Contact Form</h3> 
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                  
                  <div>
                    <input
                      type='text'
                      placeholder='Full name'
                      className='w-full p-2.5 rounded-lg border border-gray-300 dark:border-0 bg-white dark:bg-[#343a40] text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 
                                  focus:border-amber-400 focus:ring-amber-400 text-sm transition-colors duration-300'
                      required
                    />
                  </div>

                  <div>
                    <input
                      type='email'
                      placeholder='Email'
                      className='w-full p-2.5 rounded-lg border border-gray-300 dark:border-0 bg-white dark:bg-[#343a40] text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300
                                  focus:border-amber-400 focus:ring-amber-400 text-sm transition-colors duration-300'
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder='Comment...'
                      rows='4'
                      className='w-full p-2.5 rounded-lg border border-gray-300 dark:border-0 bg-white dark:bg-[#343a40] text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300
                                  focus:border-amber-400 focus:ring-amber-400 text-sm transition-colors duration-300'
                      required
                    ></textarea>
                  </div>

                  <div className='pt-2'>
                    <button
                      type='submit'
                      className='w-auto px-4 py-2.5 text-sm font-bold rounded-lg 
                                  text-[#5B3E31] bg-[#F4D77D] hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-gray-900
                                  shadow-lg transition-colors duration-300 flex items-center'
                    >
                      Submit 
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Contact;