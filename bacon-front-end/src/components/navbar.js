import React from "react";
import { Nav, NavLink, NavMenu } from "./navbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav style={{backgroundColor: "#493B29"}}>
                <NavMenu style={{margin: "auto"}}>
                    <NavLink to="/" activeStyle>
                        <h1 style={{color: "#C37532"}}>BACON</h1>
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;
