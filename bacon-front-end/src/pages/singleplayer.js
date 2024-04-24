// pages/singleplayer.js
import React, {useEffect, useState}from "react";
import "./singleplayer.css"
const Singleplayer = () => {
	const [searchVal, setSearchVal] = useState("");
	const [searchData, setSearchData] = useState([]);
	const [selectedMovie, setSelectedMovie] = useState("");
	
	useEffect(() => {
		fetch(`http://172.22.135.178:8000/movies/search/${searchVal}/10`)
				.then((resp) => {
					if(!resp.ok) {
						throw new Error ("we got ourselves a 404!")
					} else {
						return(resp.json());
					}
				})
				.then(data => setSearchData(data.data))
				.catch(err => {
					console.error(err);
					setSearchData([]);
				})
	},[searchVal]);

	return (
		<div id="main_box">
			<div id="photos_box">
				<div>
					<img id="actor_photo1"></img>
					<div id="actor_name1"><p>actor 1</p></div>
				</div>
				<div>
					<img id="actor_photo2"></img>
					<div id="actor_name2"><p>actor 2</p></div>
				</div>
			</div>
			<div>
				<input onChange={(e)=>setSearchVal(e.target.value)} type="text" id="movie_input" placeholder="movie"/>
				<div style={{position: "absolute"}}>
				{ (searchVal !== "") &&
				<div style={{backgroundColor: '#fff', zIndex: 1, position: "relative"}}>
					{console.log(searchData)}
					{searchData.map((item, index) => {				
						return(
							<p onClick={() => setSearchVal("")} key={index}>{item.title}</p>
						);
					})}
				</div>}
				</div>
			</div>
			<div id="actors_scroll">
				<p>Fred Astaire</p>
				<p>Fred Astaire</p>
				<p>Fred Astaire</p>
			</div>
		</div>
	);
};
export default Singleplayer;
