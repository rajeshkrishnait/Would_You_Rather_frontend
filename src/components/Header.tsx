import React from 'react';
import {Link} from 'react-router-dom'
import '../styles/Header.css'
const Header = () =>{
    return(
        <nav>
        <ul style={{ display: "flex", listStyleType: "none" }}>
          <li style={{ margin: "10px" }}>
            <Link to="/">Home</Link>
          </li>
          <li style={{ margin: "10px" }}>
            <Link to="/add_question">Add Question</Link>
          </li>
        </ul>
      </nav>

    )
}


export default Header;