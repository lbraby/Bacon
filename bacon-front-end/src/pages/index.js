// pages/index.js
 
import React from 'react';
import "./index.css";
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate()
    const goToSPage=()=>{
        navigate("/singleplayer");
    }
    const goToMPage=()=>{
        navigate("/multiplayer");
    }

    return (
    <div>
	 <div id="instructions">
	   <h2><br></br>This is Bacon, a game inspired by the brain teaser "six degrees of Kevin Bacon" </h2>
	   <h2><br></br>Every day there's a new daily game! Can you beat your friends' scores? </h2>
	   <h2><br></br>Need more Bacon competition? Challenge a friend to a head-to-head matchup! You'll be given the same starting and ending actors and compete to create the shortest chain between them</h2>
    	 </div>
	 <div style={{textAlign: "center"}}><button class="page_button" onClick={() => goToSPage()}>DAILY BACON</button>
	 <button class="page_button" onClick={() => goToMPage()}>MULTIPLAYER</button></div>
    </div>
  );
};
 
export default Home;
