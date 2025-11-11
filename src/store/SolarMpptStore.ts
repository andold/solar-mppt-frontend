import { makeAutoObservable } from "mobx";

import repository from "../repository/SolarMpptRepository";

// SolarMpptStore.ts
class SolarMpptStore {
	constructor() {
		makeAutoObservable(this);
	}

	search(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.search(request, onSuccess, onError, element);
	}
	crawl(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawl(request, onSuccess, onError, element);
	}
	crawlDetail(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlDetail(request, onSuccess, onError, element);
	}
	crawlClean(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.crawlClean(request, onSuccess, onError, element);
	}
	backup(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.backup(request, onSuccess, onError, element);
	}
	download(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.download(request, onSuccess, onError, element);
	}
	upload(file?: any, onSuccess?: any, onError?: any, element?: any) {
		const request = new FormData();
		request.append("file", file);
		repository.upload(request, onSuccess, onError, element);
	}
	aggregate(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.aggregate(request, onSuccess, onError, element);
	}
	test(command: any, onSuccess?: any, onError?: any, element?: any) {
		repository.test(command, onSuccess, onError, element);
	}
}

export default new SolarMpptStore();
