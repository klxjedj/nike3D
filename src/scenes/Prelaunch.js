import React, { Component } from 'react';
import { isMobile } from '../lib/common';
import desktop from '../assets/screens/prelaunch_desktop.jpg'
import mobile from '../assets/screens/prelaunch_mobile.jpg'
import swoosh from '../assets/swoosh-white.svg'


export default class Prelaunch extends Component {
  render() {

    let image = isMobile() ? mobile : desktop


    return (
      <div className="NotLaunched" style={{backgroundImage: `url(${image})`}}>
        {/* <h1 className="copy date">04/15/19</h1> */}
        {/* <div className="swoosh"><img src={swoosh}/></div> */}
      </div>
    );
  }
}
