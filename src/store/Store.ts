import { makeAutoObservable } from "mobx";

import repository from "../repository/Repository";

// Store.ts
class Store {
	constructor() {
		makeAutoObservable(this);
	}

	environment(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.environment(request, onSuccess, onError, element);
	}
}

export default new Store();
