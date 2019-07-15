import React from 'react';
import { Link } from 'react-router-dom';

import '../../css/LoginCss.css'

export default () => {
  return (
    <div className="navbarWrapper">
      <div className="navbarLogo border-bottom1">
        <i className="fas fa-piggy-bank fa-1x" style={{ color: "#FFC312" }} />{" "}
        <Link to="/">
          <span style={{ color: "#FFC312" }}>Ca$h</span>Slice{" "}
        </Link>
      </div>
      <div className="navbarCustomer border-bottom2">
        <p style={{ color: "white" }}>
          <i class="fas fa-user-circle fa-2x"/>
          Peter Zigray{" "}
        </p>
      </div>
      <div className="navbarItems">
        <ul className="nav flex-colum ">
          <li className="nav-item" />
          <li className="nav-item">
            <i class="fas fa-cog" /> Settings
          </li>
          <li className="nav-item">
            <i class="fas fa-user-plus" />
            Group
          </li>
          <li className="nav-item">
            <i class="fas fa-hand-holding-usd" /> All expenses
          </li>
          <li className="nav-item"> planet</li>
          <li className="nav-item"> account</li>
        </ul>
       
      </div>
    </div>

  
  );
}
