import axios from "axios";

// Repository.ts
class Repository {
	async environment(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("./api/environment", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
}
export default new Repository();
