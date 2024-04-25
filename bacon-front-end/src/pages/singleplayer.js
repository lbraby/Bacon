// pages/singleplayer.js
import React, {useEffect, useState}from "react";
import "./singleplayer.css"
const Singleplayer = () => {
	const [flag, setFlag] = useState(true); //Flag for first time through
	const [m2a, setM2a] = useState({}); // movie to actor result
	const [m2m, setM2m] = useState({}); // movie to movie result
	const [dailyActors, setDailyActors] = useState({}); // 2 daily actors
	const [searchVal, setSearchVal] = useState(""); // search bar value
	const [searchData, setSearchData] = useState([]); // search bar stuff
	const [selectedMovie, setSelectedMovie] = useState([]); // essentially current movie
	const [boxDisplay, setBoxDisplay] = useState([]); // Info to be displayed

	const appendToBoxDisplay = (thing)=> {
		// Appends to the list to be displayed on the UI
		let prevBoxDisplay = [...boxDisplay];
		prevBoxDisplay.push(thing);
		setBoxDisplay(prevBoxDisplay);
	}

	const movie2actor = (movieid, actorid) => {
		// Calls movieperson API to compare an actor and movie
		fetch(`http://172.22.132.192:8000/link/movieperson/${movieid}/${actorid}`)
			.then((resp) => {
				if(!resp.ok) {
					throw new Error ("404")
				} else {
					return(resp.json());
				}
			})
			.then(data => setM2a(data))
			.catch(err => { console.error(err); });
	}
	
	const movie2movie = (movie) => {
		// Searches moviemovie API for comparing two movies
		fetch(`http://172.22.132.192:8000/link/moviemovie/${selectedMovie.movie_id}/${movie.movie_id}`)
			.then((resp) => {
				if(!resp.ok) {
					throw new Error ("404")
				} else {
					return(resp.json());
				}
			})
			.then(data => console.log(data))
			.catch(err => { console.error(err); });
	}

	
	const movieSelected = (movie) => {
		setSearchVal("");
		console.log(movie);
		if (flag) {

			movie2actor(movie.movie_id, dailyActors.person1.person_id); //this is right for the previous click but not updating for the current one
			// if m2a.result == 'success': set selectedMovie to movie, flag to false, append movie to boxDisplay
			// if m2a.result == 'failure': return false
		} else {
			movie2movie(movie.movie_id, selectedMovie.movie_id);
			// if m2m isn't empty, it works
			// if it works, add the movie and actor to boxDisplay, set selectedMovie to movie
			// if it doesn't, return something false-esque
		}
		movie2actor(selectedMovie.movie_id, dailyActors.person2.person_id);
		// try movie2actor on the new selectedMovie and actor 2, if it works then end the game
		// if it doesn't work, return true
	}


	useEffect(() => {
		fetch(`http://172.22.132.192:8000/movies/search/${searchVal}/10`)
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

	useEffect(() => {
		fetch(`http://172.22.132.192:8000/dailymode`)
			.then((resp) => {
				if(!resp.ok) {
					throw new Error ("404")
				} else {
					return(resp.json());
				}
			})
			.then(data => {setDailyActors(data)})
			.catch(err => {
				console.error(err);
			})
	},[]);

	return (
		<div id="main_box">
			<div>
				{(Object.keys(dailyActors).length === 0)
					?
					<div>
						loading...
					</div>
					:
					<div id="photos_box">
						<div>
							<img id="actor_photo1"/>
							<div id="actor_name1">
								<p>{dailyActors.person1.name}</p>
							</div>
						</div>
						<div>
							<img id="actor_photo2"/>
							<div id="actor_name2"><p>{dailyActors.person2.name}</p></div>
						</div>
					</div>
				}
			</div>
			<div>
				<input onChange={(e)=>setSearchVal(e.target.value)} type="text" id="movie_input" placeholder="movie"/>
				<div style={{position: "absolute"}}>
				{ (searchVal !== "") &&
				<div style={{backgroundColor: '#E2E3E0', zIndex: 1, position: "relative"}}>
					{console.log(searchData)}
					{searchData.map((item, index) => {		
						console.log(item);
						return(
							<p onClick={() => {movieSelected(item)}} key={index}>{item.title}</p>
						);
					})}
				</div>}
				</div>
			</div>
			<div id="actors_scroll">
				{boxDisplay.map(function(d, idx){
        				return (<li key={idx}>{d.name}</li>);
				})}
			</div>
		</div>
	);
};
export default Singleplayer;
