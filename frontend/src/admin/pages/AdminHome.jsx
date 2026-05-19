import React from 'react'
import Navbar from '../components/AdminNavbar'
import AddPage from '../components/addPage'
import { List } from 'lucide-react'
// import ListMoviesPage from '../components/ListMoviesPage'
// import Bookings from '../components/Bookings'
// import DashboardPage from '../components/DashboardPage'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <AddPage/>
      {/* <ListMoviesPage/> */}
      {/* <DashboardPage/> */}
      {/* <Bookings/> */}
    </div>
  )
}

export default Home
