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