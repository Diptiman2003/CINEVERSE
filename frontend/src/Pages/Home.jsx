import React from 'react'
import NavBar from '../components/NavBar'
import Banner from '../components/Banner'
import Movies from '../components/Movies'
import News from '../components/News'
import Footer from '../components/Footer'
import Trailers from '../components/Trailers'
import FestivalBanner from '../components/FestivalBanner'
import DiscountBanner from '../components/DiscountBanner'
// import NearestTheatres from '../components/NearestTheatres'   // new
const Home = () => {
  return (

    <div>
      <NavBar/>
      <Banner/>
      <Movies/>
      {/* <NearestTheatres /> */}
      <Trailers/>
      <DiscountBanner/>
      <News/>
      <Footer/>
    </div>
    
  )
}

export default Home;

