import React from 'react'
import {Link} from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
const eventPage = () => {
  return (

   <button><div><Link to='/student-dashboard'><ArrowLeft/></Link></div> </button>
  )
}

export default eventPage