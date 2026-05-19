// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// // import ListMoviesPage from './components/ListMoviesPage'
// import DashboardPage from './pages/Dashboard'
// import BookingsPage from './pages/BookingsPage';
// import List from './pages/List'



// const App = () => {
//   return (
//     <Routes>
//       <Route path='/' element={<Home/>}/>
//       {/* <Route path='/listmovies' element={<ListMoviesPage/>}/> */}
//       <Route path='/listmovies' element={<List/>}/>
//       <Route path='/dashboard' element={<DashboardPage/>}/>
      
//       <Route path='/bookings' element={<BookingsPage/>}/>
//     </Routes>
//   )
// }

// export default App;



//claude ai 
// App.jsx
// Place in: admin/src/App.jsx — replace existing

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ListMoviesPage from './components/ListMoviesPage'
import DashboardPage from './pages/Dashboard'
import BookingsPage from './pages/BookingsPage'
import UserManagement from './pages/UserManagement'   // ← NEW

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/listmovies' element={<ListMoviesPage/>}/>
      <Route path='/dashboard' element={<DashboardPage/>}/>
      <Route path='/bookings' element={<BookingsPage/>}/>
      <Route path='/users' element={<UserManagement/>}/>   {/* ← NEW */}
    </Routes>
  )
}

export default App
