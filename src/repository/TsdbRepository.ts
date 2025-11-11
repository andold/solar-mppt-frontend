import axios from "axios";

// TsdbRepository.ts
class TsdbRepository {
	async search(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("./tsdb/api/search", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
}
export default new TsdbRepository();
