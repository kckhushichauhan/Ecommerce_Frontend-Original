import React from 'react'
import "./Home.css"
import cartimage from "../Assets/CartImage.jpg"
const Home = () => {
  return (
    <div className='homepage'>
      <img src={cartimage} alt="ecommerce-website"/>
      <div className='contentleft'>
      <h1>Ecommerce Solutions</h1>
      <h2>Empowering Your Shopping Experience<br></br>  with Innovation.</h2>
        <p>Your one-stop digital shop, providing innovative <br></br>solutions and products that cater to all your tech needs.</p>
    </div>
    </div>
  )
}

export default Home
