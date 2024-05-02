import React from "react";
import { Link } from "react-router-dom";
import logo from "../pages/Bacon.png";
import question from "./help.png";
 
const Navbar = () => {
    return (
        <div style={{width: "100%"}}>
            <div style={{
                width: "50%",
                margin: "auto",
                borderBottom: "solid black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "25px",
            }}>
                <Link to={"/"}>
                    <img src={logo} alt="bacon" style={{height: "2.5em", marginLeft: "0px", marginRight: "0px", marginTop: "auto", marginBottom: "10px"}} href={"https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon"}/>
                </Link>
                <h1 style={{color: "#fc873d", fontFamily:"eczar", fontSize: "2.5em", lineHeight: 1, padding: "0px", margin: "0px", marginBottom: "10px"}}>BACON</h1>
                <a 
                    href="https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={question} style={{height: "2.5em", marginLeft: "0px", marginRight: "0px", marginTop: "auto", marginBottom: "10px"}} alt="help"/>
                </a>
            </div>
        </div>
    );
};
 
export default Navbar;
