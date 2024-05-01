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
    	 	<h4>Welcome to Bacon, the ultimate Six Degrees of Kevin Bacon-style challenge! Test your actor knowledge with our Daily Mode, featuring new pairs of actors every day at midnight.</h4>
	    	<h4>For some competitive fun, dive into Multiplayer mode where you can challenge friends and fellow users. Race against the clock to connect your actor to your opponent's choice. Shortest links or quickest time secures the win! Ready to play? Let's turn up the heat and get the Bacon sizzling!</h4>
	 </div>
	 <div style={{textAlign: "center"}}>
	   <button class="page_button" onClick={() => goToSPage()}>DAILY BACON</button>
	   <div><button class="page_button" onClick={() => goToMPage()}>MULTIPLAYER</button></div>
	 </div>
       </div>
  );
};
 
export default Home;
