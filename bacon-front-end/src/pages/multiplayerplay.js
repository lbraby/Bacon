// pages/multiplayer.js
import React, {useEffect, useState }from "react";
import { useNavigate } from "react-router-dom";
import "./singleplayer.css";
import Modal from "./modal";
import logo from "./Bacon.png";
import pig from "./pig.gif";
import Timer from "./timer";
import { checkGuestPulse, sendPulseGuest, sendPulseHost, checkHostPulse, apiWrapper } from "../services/apiServices";

const MultiplayerPlay = ({userType, gameId}) => {
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
	const [count, setCount] = useState(0);
	const [gameDone, setGameDone] = useState(0);
	const [result, setResult] = useState("")
	const [myLinks, setMyLinks] = useState(0);
	const [myTime, setMyTime] = useState(0);
	const [otherLinks, setOtherLinks] = useState(0);
	const [otherTime, setOtherTime] = useState(0);
	const [timeOutExplanation, setTimeOutExplanation] = useState("");
	const totalSeconds = 150;

	useEffect(() => {
		// update count every second
		setTimeout(() => {
			let prevCount = count;
			setCount(prevCount + 1);
			// send pulse
			if(userType === "host") {
				sendPulseHost(gameId)
				.catch(err => console.error("error updating status " + err));
				checkGuestPulse(gameId)
				.then(data => {
					if (data.elapsed_seconds >= 3) {
						setStatus(4);
					}
				})
				.catch(err => console.error("error checking status " + err));
			} else {
				sendPulseGuest(gameId)
				.catch(err => console.error("error updating status " + err));
				checkHostPulse(gameId)
				.then(data => {
					if (data.elapsed_seconds >= 3) {
						setStatus(4);
					}
				})
				.catch(err => console.error("error checking tatus " + err));
			}
			// check if game is done
			if (!gameDone) {
				apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/getscores/`)
				.then(data => {
					const hostLink = data.userhost_link_count;
					const guestLink = data.otheruser_link_count;
					const hostTime = data.userhost_time_seconds;
					const guestTime = data.otheruser_time_seconds;
					if(hostLink !== null && guestLink !== null) {
						setGameDone(1);
						setStatus(3);
						if (userType === "host") {
							setMyLinks(hostLink);
							setMyTime(hostTime);
							setOtherLinks(guestLink);
							setOtherTime(guestTime);

							if (hostLink < guestLink) {
								setResult("win");
							} else if (hostLink > guestLink) {
								setResult("lose");
							// if link count equal
							} else {
								if (hostTime < guestTime) {
									setResult("win");
								} else if (hostTime > guestTime) {
									setResult("lose");
								} else {
									setResult("tie");
								}
							}
						}
						else {
							setMyLinks(guestLink);
							setMyTime(guestTime);
							setOtherLinks(hostLink);
							setOtherTime(hostTime);

							if (hostLink > guestLink) {
								setResult("win");
							} else if (hostLink < guestLink) {
								setResult("lose");
							// if link count equal
							} else {
								if (hostTime > guestTime) {
									setResult("win");
								} else if (hostTime < guestTime) {
									setResult("lose");
								} else {
									setResult("tie");
								}
							}
						}
					}
				})
			}
			// check if timer is done
			if ((totalSeconds - count) === -1) {
				apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/getscores/`)
				.then(data => {
					const hostLink = data.userhost_link_count;
					const guestLink = data.otheruser_link_count;

					if (userType === "host") {
						if (hostLink != null && guestLink == null) {
							setResult("won");
							setTimeOutExplanation("Your opponent timed out.");
						}
						else if (hostLink == null && guestLink != null) {
							setResult("lose");
							setTimeOutExplanation("You timed out.");
						}
						else {
							setResult("tied");
							setTimeOutExplanation("You both timed out.");
						}
					} else {
						if (hostLink == null && guestLink != null) {
							setResult("won");
							setTimeOutExplanation("Your opponent timed out.");
						}
						else if (hostLink != null && guestLink == null) {
							setResult("lose");
							setTimeOutExplanation("You timed out.");
						}
						else {
							setResult("tied");
							setTimeOutExplanation("You both timed out.");
						}
					}
					setStatus(6);
				})

			}
		}, 1000);
	}, [count, gameId, userType]);

	const submitScore = () => {
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		};
		if (userType === "guest") {
			apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/score/otheruser/${count}/${boxDisplay.length}/`, options)
			.then(() => setStatus(5))
		} else {
			apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/score/userhost/${count}/${boxDisplay.length}/`, options)
			.then(() => setStatus(5))
		}
	};

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
	const getMovie = (movie_id) => {
		// Gets actor from API
		return new Promise((resolve, reject) => {
			fetch(`${process.env.REACT_APP_API_URL}/movies/${movie_id}`)
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
					getMovie(movie.movie_id).then((m) => {
						if(m) {
							appendToBoxDisplay(m);
						}
						else {
							console.log("waiting on getMovie");
						}
				  	});
					movie2actor(movie.movie_id, dailyActors.person2.person_id).then((result) => {
						if (result) {
							setGameOver(true);
							submitScore();
						} else {
							setStatus(2);
							setAlertText(`${dailyActors.person2.name} was not in ${movie.title}, keep going!`);
						}
					});
					setSelectedMovie(movie);
					getMovie(movie.movie_id).then((m) => {
						if(m) {
							appendToBoxDisplay(m);
						}
						else {
							console.log("waiting on getMovie");
						}
				  	});
				} else {
					setStatus(1);
					setAlertText(`${selectedMovie.title} and ${movie.title} do not share an actor/director, try again!`)
				}
			});
		} else {
			// if this is the first time
			movie2actor(movie.movie_id, dailyActors.person1.person_id).then((result) => {
				if (result) {
					getMovie(movie.movie_id).then((m) => {
						if(m) {
						  appendToBoxDisplay(m);
					  }
					  else {
						  console.log("waiting on getMovie");
					  }
				  	});
					appendToActDisplay(dailyActors.person1.name);
					movie2actor(movie.movie_id, dailyActors.person2.person_id).then((result) => {
						if (result) {
							setGameOver(true);
							submitScore();
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
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				count: 10,
				search: searchVal
			})
		};
		
		apiWrapper(`${process.env.REACT_APP_API_URL}/movies/search/`, options)
			.then(data => setSearchData(data.data))
			.catch(err => {
				console.error(err);
				setSearchData([]);
			})
	},[searchVal]);

	useEffect(() => {
		apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/getselectedpeople/`)
		// get starting actors
		.then(data => {
			if (data.userhost_person_id && data.otheruser_person_id) {
				fetchDailyActors(data.userhost_person_id, data.otheruser_person_id);
			}
		})
		.catch(err => {
			console.error("error fetching actors " + err);
		})
	},[]);

	const fetchDailyActors = (start_id, end_id) => {
		var startingActor = {};
		var endingActor = {};
		getActor(start_id)
			.then(data => {
				startingActor = data;
			})
				.then(() => {
					getActor(end_id)
						.then((data) => {
							endingActor = data;
							setDailyActors({
								"person1":startingActor,
								"person2":endingActor
							});
						})
				})
	};

	return (
		<div>
		{
			(Object.keys(dailyActors).length === 0)
			?
			<div>Loading...</div>
			:
			<div id="main_box">
				{(status === 3) &&
					<Modal isOpen={modalIsOpen} onClickOutside={() => {}}>
						<div>
						{
							(result === "win")
							?
							<div><img src={pig} style={{width: "30%"}} alt={"pig"}/></div>
							:
							<div><img src={logo} style={{width: "20%"}} alt={"bacon"}/></div>
						}
						</div>
						<h3>You {result}!</h3>
						<div style={{display: "flex", flexDirection: "row", gap: "30px", justifyContent: "center"}}>
							<div>
								<p>{`Your link count: ${myLinks + 1}`}</p>
								<p>{`Your time: ${myTime}`}</p>
							</div>
							<div>
								<p>{`Opponent link count: ${otherLinks + 1}`}</p>
								<p>{`Opponent time: ${otherTime}`}</p>
							</div>

						</div>
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
				{(status === 4) &&
					<Modal isOpen={modalIsOpen} onClickOutside={() => {}}>
						<img src={pig} style={{width: "30%"}}/>
						<h3>You win!</h3>
						<p>Your opponent left the game!</p>
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
				{(status === 5) &&
					<Modal isOpen={modalIsOpen} onClickOutside={() => {}}>
						<h3>You finished!</h3>
						<p>{`You connected ${dailyActors.person1.name} to ${dailyActors.person2.name} in ${boxDisplay.length}`}</p>
						<p>Waiting for your opponent</p>
					</Modal>
				}
				{(status === 6) &&
					<Modal isOpen={modalIsOpen} onClickOutside={() => {}}>
						<h3>{`You ${result}!`}</h3>
						<p>{timeOutExplanation}</p>
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
						<div class="container">
							<div class="child" style={{width: "30%"}}>
								<img id="actor_photo1" alt="actor_photo1" src={`${dailyActors.person1.image_path}`}/>
								<p id="actor_name1">{dailyActors.person1.name}</p>
							</div>
							<div class="child" style={{width: "20%"}}>
								<h1 id="scoreboard">{boxDisplay.length}</h1>
								<img id="bacon" src={logo} alt="score"/>
							</div>
							<div class="child" style={{width: "30%"}}> 
								<img id="actor_photo2" alt="actor_photo2" src={`${dailyActors.person2.image_path}`}/>
								<p id="actor_name2">{dailyActors.person2.name}</p>
							</div>
						</div>
					}
				</div>
				<Timer totalSeconds={totalSeconds} newSeconds={count}/>
				{((status === 1) || (status === 2))
					&&
					<h3 style={{marginBottom: "0px"}}>
						{alertText}
					</h3>
				}
				<div>
					<input onChange={(e)=>setSearchVal(e.target.value)} type="text" id="movie_input" placeholder="movie"/>
					<div style={{position: "relative", textAlign: "center"}}>
					{ (searchVal !== "") &&
					<div id="search_results">
						{searchData.map((item, index) => {		
							if(item.release_date) {
								return(
									<p class="m_result" onClick={() => {movieSelected(item)}} key={index}>{item.title} ({item.release_date.split(" ")[3]})</p>
								);
							} else {
								return(
									<p class="m_result" onClick={() => {movieSelected(item)}} key={index}>{item.title}</p>
								);
							}
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
											<div class="movie_title">
												<h4 style={{marginBottom: "3px", marginTop: "8px", fontFamily: "eczar"}}><b>{d.title} {d.release_date.split(" ")[3]}</b></h4>
												{(d.director) &&
													<p style={{marginBottom: "3px", marginTop: "3px"}}> -Directed by: {d.director.name}</p>
												}
												{(d.actors) &&
													<p style={{marginBottom: "3px", marginTop: "3px"}}> -Starring: {d.actors[0].name}, {d.actors[1].name}, {d.actors[2].name}</p>
												}
											</div>
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
		}
		</div>
	);
};
export default MultiplayerPlay;
