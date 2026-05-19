import React from 'react'
// import Navbar from '../components/Navbar'
import ListMoviesPage from '../components/ListMoviesPage'
import NavBar from '../../../frontend/src/components/NavBar'

const List = () => {
  return (
    <div>
        {/* <Navbar /> */}
        <NavBar />
        <ListMoviesPage />
    </div>
  )
}

export default List