import React from "react";
import { Nav, NavLink, NavMenu } from "./navbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        Home
                    </NavLink>
                    <NavLink to="/singleplayer" activeStyle>
                        Daily Bacon
                    </NavLink>
                    <NavLink to="/multiplayer" activeStyle>
                        Multiplayer
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;
