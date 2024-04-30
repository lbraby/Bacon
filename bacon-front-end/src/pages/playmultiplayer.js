// pages/playmultiplayer.js
import React, {useEffect, useState}from "react";
import "./playmultiplayer.css"
import Timer from "./timer";
const MultiplayerPlay = () => {
	const [firstTimeDone, setFirstTimeDone] = useState(false); //Flag for first time through
	const [dailyActors, setDailyActors] = useState({}); // 2 daily actors
	const [searchVal, setSearchVal] = useState(""); // search bar value
	const [searchData, setSearchData] = useState([]); // search bar stuff
	const [selectedMovie, setSelectedMovie] = useState({}); // essentially current movie
	const [boxDisplay, setBoxDisplay] = useState([]); // Info to be displayed
	const [count, setCount] = useState(0);
	const totalSeconds = 150;

	const appendToBoxDisplay = (thing)=> {
		// Appends to the list to be displayed on the UI
		let prevBoxDisplay = [...boxDisplay];
		prevBoxDisplay.push(thing);
		setBoxDisplay(prevBoxDisplay);
	}

	const movie2actor = (movieid, actorid) => {
		// Calls movieperson API to compare an actor and movie
		return new Promise((resolve, reject) => {
			fetch(`${process.env.REACT_APP_API_URL}/link/movieperson/${movieid}/${actorid}`)
			.then((resp) => {
				if(!resp.ok) {
					reject(new Error ("404"));
				} else {
					return(resp.json());
				}
			})
			.then(data => 
			{
				if (data.result === "success") {
					resolve(1);
				} else {
					resolve(0);
				}
			})
		})
	}
	
	const movie2movie = (movie_id, selectedMovie_id) => {
		// Searches moviemovie API for comparing two movies
		return new Promise((resolve, reject) => {
			fetch(`${process.env.REACT_APP_API_URL}/link/moviemovie/${selectedMovie_id}/${movie_id}`)
			.then((resp) => {
				if(!resp.ok) {
					reject(new Error ("404"));
				} else {
					return(resp.json());
				}
			})
			.then(data => {
				if (data.result === "success") {
					resolve(1);
				} else {
					resolve(0);
				}
			})
			.catch(err => { console.error(err); });
		});
	}

	
	const movieSelected = (movie) => {
		setSearchVal("");
		if (firstTimeDone) {
			// if this is not the first time
			movie2movie(movie.movie_id, selectedMovie.movie_id).then((result) => {
				if (result) {
					movie2actor(movie.movie_id, dailyActors.person2.person_id).then((result) => {
						if (result) {
							alert("he in both movies, game over");
						} else {
							alert("1st actor in movie, 2nd actor not tho, keep going!");
						}
					});
					setSelectedMovie(movie);
					appendToBoxDisplay(movie);
				} else {
					alert("he not in that, try again");
				}
			});
		} else {
			// if this is the first time
			movie2actor(movie.movie_id, dailyActors.person1.person_id).then((result) => {
				if (result) {
					movie2actor(movie.movie_id, dailyActors.person2.person_id).then((result) => {
						if (result) {
							alert("he in both movies, game over");
						} else {
							alert("1st actor in the movie, 2nd actor not, keep going!");
							setFirstTimeDone(true);
						}
					});
					setSelectedMovie(movie);
					appendToBoxDisplay(movie);
				} else {
					alert("he not in that, try again");
				}
			});
		}
	}


	useEffect(() => {
		// call search api when search bar updated
		fetch(`${process.env.REACT_APP_API_URL}/movies/search/${searchVal}/10`)
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
		fetch(`${process.env.REACT_APP_API_URL}/dailymode`)
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

	useEffect(() => {
		// update count every second
		setTimeout(() => {
			let prevCount = count;
			setCount(prevCount + 1);
			if ((totalSeconds - (prevCount + 1)) === 0 ) {
				alert("timer done!");
			}
		}, 1000);
	}, [count]);

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
							<img id="actor_photo1" alt="actor_photo1"/>
							<div id="actor_name1">
								<p>{dailyActors.person1.name}</p>
							</div>
						</div>
						<div>
							<img id="actor_photo2" alt="actor_photo1"/>
							<div id="actor_name2"><p>{dailyActors.person2.name}</p></div>
						</div>
					</div>
				}
			</div>
			<Timer totalSeconds={totalSeconds} newSeconds={count} />
			<div>
				<input onChange={(e)=>setSearchVal(e.target.value)} type="text" id="movie_input" placeholder="movie"/>
				<div style={{position: "absolute"}}>
				{ (searchVal !== "") &&
				<div style={{backgroundColor: '#E2E3E0', zIndex: 1, position: "relative"}}>
					{searchData.map((item, index) => {		
						return(
							<p onClick={() => {movieSelected(item)}} key={index}>{item.title}</p>
						);
					})}
				</div>}
				</div>
			</div>
			<div id="actors_scroll">
				{boxDisplay.map(function(d, idx){
        			return (<li key={idx}>{d.title}</li>);
				})}
			</div>
		</div>
	);
};
export default MultiplayerPlay;
