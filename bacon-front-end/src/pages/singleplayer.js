// pages/singleplayer.js
import React, {useEffect, useState }from "react";
import { useNavigate } from "react-router-dom";
import "./singleplayer.css";
import Modal from "./modal";
import logo from "./Bacon.png";

const Singleplayer = () => {
	const [firstTimeDone, setFirstTimeDone] = useState(false); //Flag for first time through
	const [dailyActors, setDailyActors] = useState({}); // 2 daily actors
	const [searchVal, setSearchVal] = useState(""); // search bar value
	const [searchData, setSearchData] = useState([]); // search bar stuff
	const [selectedMovie, setSelectedMovie] = useState({}); // essentially current movie
	const [boxDisplay, setBoxDisplay] = useState([]); // Info to be displayed
	const [actDisplay, setActDisplay] = useState([]); // Info to be displayed
	const [gameOver, setGameOver] = useState(false);
	const [status, setStatus] = useState(0);
	const [modalIsOpen, setModalIsOpen] = useState(true);
	const [alertText, setAlertText] = useState("");
	const navigate = useNavigate();

	const appendToBoxDisplay = (thing)=> {
		// Appends to the list to be displayed on the UI
		let prevBoxDisplay = [...boxDisplay];
		prevBoxDisplay.push(thing);
		setBoxDisplay(prevBoxDisplay);
	}

	const appendToActDisplay = (thing)=> {
		// Appends to the actor list to be displayed on the UI
		let prevActDisplay = [...actDisplay];
		prevActDisplay.push(thing);
		setActDisplay(prevActDisplay);
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
					resolve(data);
				} else {
					resolve([]);
				}
			})
			.catch(err => { console.error(err); });
		});
	}
	
	const getActor = (actor_id) => {
		// Gets actor from API
		return new Promise((resolve, reject) => {
			fetch(`${process.env.REACT_APP_API_URL}/people/${actor_id}`)
			.then((resp) => {
				if(!resp.ok) {
					reject(new Error ("404"));
				} else {
					return(resp.json());
				}
			})
			.then(data => {
				if (data) {
					resolve(data);
				} else {
					resolve([]);
				}
			})
			.catch(err => {console.error(err);});
		});
	}
	
	const movieSelected = (movie) => {
		setSearchVal("");
		if (firstTimeDone) {
			// if this is not the first time
			movie2movie(movie.movie_id, selectedMovie.movie_id).then((result) => {
				if (result.length !== 0) {
					getActor(result.list[0][0]).then((actor) => {
						appendToActDisplay(actor.name);
					});
					appendToBoxDisplay(movie);
					movie2actor(movie.movie_id, dailyActors.person2.person_id).then((result) => {
						if (result) {
							setGameOver(true);
							setStatus(3);
						} else {
							setStatus(2);
							setAlertText(`${dailyActors.person2.name} was not in ${movie.title}, keep going!`);
						}
					});
					setSelectedMovie(movie);
					appendToBoxDisplay(movie);
				} else {
					setStatus(1);
					setAlertText(`${selectedMovie.title} and ${movie.title} do not share an actor/director, try again!`)
				}
			});
		} else {
			// if this is the first time
			movie2actor(movie.movie_id, dailyActors.person1.person_id).then((result) => {
				if (result) {
					appendToBoxDisplay(movie);
					appendToActDisplay(dailyActors.person1.name);
					movie2actor(movie.movie_id, dailyActors.person2.person_id).then((result) => {
						if (result) {
							setGameOver(true);
							setStatus(3);
						} else {
							setStatus(2);
							setAlertText(`${dailyActors.person2.name} was not in ${movie.title}, keep going!`);
							setFirstTimeDone(true);
						}
					});
					setSelectedMovie(movie);
				} else {
					setStatus(1);
					setAlertText(`${dailyActors.person1.name} was not in ${movie.title}, try again!`)
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

	return (
		<div id="main_box">
			{(status === 3) &&
				<Modal isOpen={modalIsOpen}>
					<h3>You win!</h3>
					<p>{`${dailyActors.person1.name} and ${dailyActors.person2.name} are both in ${selectedMovie.title}`}</p>
					<button 
						onClick={() => {
							setModalIsOpen(0);
							navigate("/");
						}}
					>
						Close
					</button>
				</Modal>
			}
			<div>
				{(Object.keys(dailyActors).length === 0)
					?
					<div>
						loading...
					</div>
					:
					<div id="photos_box">
						<div>
							<img id="actor_photo1" alt="actor_photo1" src={`${dailyActors.person1.poster_path}`}/>
							<div id="actor_name1"><p>{dailyActors.person1.name}</p></div>
						</div>
						<div>
							<h1 id="scoreboard">{boxDisplay.length}</h1>
							<img id="bacon" src={logo} alt="score"/>
						</div>
						<div> 
							<img id="actor_photo2" alt="actor_photo2" src={`${dailyActors.person2.poster_path}`}/>
							<div id="actor_name2"><p>{dailyActors.person2.name}</p></div>
						</div>
					</div>
				}
			</div>
			{((status === 1) || (status === 2))
				&&
				<h3 style={{marginBottom: "0px"}}>
					{alertText}
				</h3>
			}
			<div>
				<input onChange={(e)=>setSearchVal(e.target.value)} type="text" id="movie_input" placeholder="movie"/>
				<div style={{position: "absolute"}}>
				{ (searchVal !== "") &&
				<div style={{backgroundColor: '#E2E3E0', zIndex: 1, position: "relative"}}>
					{searchData.map((item, index) => {		
						return(
							<div>
								{(item.release_date)
									?
									<p onClick={() => {movieSelected(item)}} key={index}>{item.title} ({item.release_date.split(" ")[3]})</p>
									:
									<p onClick={() => {movieSelected(item)}} key={index}>{item.title}</p>
								}
							</div>
						);
					})}
				</div>}
				</div>
			</div>
			<div id="actors_scroll">
				{boxDisplay.map((d, idx) => {
					return (
						<div>
							{(Object.keys(d).length !== 0) &&
								<div key={idx}>
									<div class="actor_item">
										<p>{actDisplay[idx]}</p>
									</div>
									<div class="movie_item">
										<img class="movie_poster" src={`${d.poster_path}`} alt="movie_poster"/>
										<div class="movie_title"><p>{d.title} {d.release_date.split(" ")[3]}</p></div>
									</div>
								</div>
							}
						</div>
					);
				})}
				{gameOver &&
					<div class="actor_item"><p>{dailyActors.person2.name}</p></div>
				}
			</div>
		</div>
	);
};
export default Singleplayer;
