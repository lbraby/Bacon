import React from "react";
import { Nav, NavLink, NavMenu } from "./navbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav style={{background: "#E2E3E0", borderBottom: "solid black", width: "10%", margin: "auto"}}>
                <NavMenu style={{margin: "auto"}}>
                    <NavLink to="/" activeStyle>
                        <h1 style={{color: "#fc873d", fontFamily:"eczar", fontSize: "2.5em"}}>BACON</h1>
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;
