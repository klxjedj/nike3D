import React, { Component } from 'react';
import { isMobile } from '../lib/common';
import desktop from '../assets/screens/sunset_desktop.jpg'
import mobile from '../assets/screens/sunset_mobile.jpg'
import swoosh from '../assets/swoosh-white.svg'


export default class Sunset extends Component {
  componentDidMount = () => {
    setTimeout(() => {
      window.location.href = "https://www.nike.com/us/en_us/c/nikeid";
    }, 5000)
  }
  render() {

    let image = isMobile() ? mobile : desktop

    return (
      <div className="Sunset" style={{ backgroundImage: `url(${image})` }}>
        {/* <h1 className="copy">No longer available</h1> */}
        {/* <div className="swoosh"><img src={swoosh}/></div> */}
      </div>
    );
  }
}
