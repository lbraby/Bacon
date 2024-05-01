export const apiWrapper = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options)
			.then((resp) => {
				if(!resp.ok) {
					return(new Error ("404"));
				} else {
					resolve(resp.json());
				}
			})
            .catch(err => reject(err));
    })
};

export const sendPulseHost = (gameId) => {
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	};
	return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/pulse/userhost/`, options)
			.then((resp) => {
				if(!resp.ok) {
					return(new Error ("404"));
				} else {
					resolve(resp.json());
				}
			})
            .catch(err => reject(err));
    })
};

export const sendPulseGuest = (gameId) => {
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	};
	return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/pulse/otheruser/`, options)
			.then((resp) => {
				if(!resp.ok) {
					return(new Error ("404"));
				} else {
					resolve(resp.json());
				}
			})
            .catch(err => reject(err));
    })
};

export const checkHostPulse = (gameId) => {
	const options = {};
	return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/pulsecheck/userhost/`, options)
			.then((resp) => {
				if(!resp.ok) {
					return(new Error ("404"));
				} else {
					resolve(resp.json());
				}
			})
            .catch(err => reject(err));
    })
};

export const checkGuestPulse = (gameId) => {
	const options = {};
	return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/pulsecheck/otheruser/`, options)
			.then((resp) => {
				if(!resp.ok) {
					return(new Error ("404"));
				} else {
					resolve(resp.json());
				}
			})
            .catch(err => reject(err));
    })
};