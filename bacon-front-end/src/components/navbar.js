import React from "react";
import { Nav, NavLink, NavMenu } from "./navbarElements";
import logo from "../pages/Bacon.png";
import question from "./help.png";
 
const Navbar = () => {
    return (
        <>
            <Nav style={{background: "#E2E3E0", borderBottom: "solid black", width: "10%", margin: "auto"}} className="justify-content-center">
	    	<img src={logo} style={{width:"60%", height: "50%"}} alt="bacon"/>
                <NavMenu style={{margin: "auto"}}>
                    <NavLink to="/" activeStyle>
                        <h1 style={{color: "#fc873d", fontFamily:"eczar", fontSize: "2.5em"}}>BACON</h1>
                    </NavLink>
                </NavMenu>
	      	<img src={question} style={{width: "50%", height: "50%"}} alt="help"/>
            </Nav>
        </>
    );
};
 
export default Navbar;
