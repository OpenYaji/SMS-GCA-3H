import React from 'react'
import Header from '../common/homepage/enrollHeader'
import Enroll from '../common/homepage/enroll'
import Footer from '../common/homepage/footer'
const admissionpage = () => {
  return (
    <>
      <Header />
      <main className=' min-h-screen'>
        <section id="home">
          <Enroll />
        </section>
      </main>
      <Footer />
    </>

  )
}

export default admissionpage