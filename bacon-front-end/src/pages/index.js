// pages/index.js
 
import React from 'react';
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
	 <h1><br></br>This is Bacon, a game inspired by the brain teaser "six degrees of Kevin Bacon" </h1>
	 <h1><br></br>Every day there's a new daily game! Can you beat your friends' scores? </h1>
	 <h1><br></br>Need more Bacon competition? Challenge a friend to a head-to-head matchup! You'll be given the same starting and ending actors and compete to create the shortest chain between them</h1>
    	 
	 <button onClick={() => goToSPage()} className="btn">DAILY BACON</button>
	 <button onClick={() => goToMPage()} className="btn">MULTIPLAYER</button>
    </div>
  );
};
 
export default Home;
