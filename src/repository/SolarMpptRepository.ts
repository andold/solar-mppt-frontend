import axios from "axios";

// SolarMpptRepository.ts
class SolarMpptRepository {
	async search(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("/terran/solar-mppt/search", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawl(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("/terran/solar-mppt/crawl", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlDetail(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("/terran/solar-mppt/crawl/detail", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async crawlClean(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post("/terran/solar-mppt/crawl/clean", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async backup(request?: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get("/terran/solar-mppt/backup", request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async download(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios({
			url: "/terran/solar-mppt/download",
			method: "GET",
			responseType: "blob",
		}).then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", request.filename);
			document.body.appendChild(link);
			link.click();
			link.parentNode!.removeChild(link);
			onSuccess && onSuccess(request, response.data, element);
		}).catch(error => onError && onError(request, error, element));
	}
	async upload(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`/terran/solar-mppt/upload`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async aggregate(request: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.post(`/terran/solar-mppt/aggregate`, request)
			.then(response => onSuccess && onSuccess(request, response.data, element))
			.catch(error => onError && onError(request, error, element));
	}
	async test(command: any, onSuccess?: any, onError?: any, element?: any) {
		return axios.get(`/terran/solar-mppt/test?command=${command}`)
			.then(response => onSuccess && onSuccess(command, response.data, element))
			.catch(error => onError && onError(command, error, element));
	}
}
export default new SolarMpptRepository();
