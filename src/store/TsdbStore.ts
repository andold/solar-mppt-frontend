import { makeAutoObservable } from "mobx";

import repository from "../repository/TsdbRepository";

// domain
import TsdbModel from "../model/TsdbModel";
import SolarMpptModel from "../model/SolarMpptModel";

// TsdbStore.ts
class TsdbStore {
	constructor() {
		makeAutoObservable(this);
	}

	search(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.search(request, (_: any, result: any) => {
				const models: TsdbModel[] = result?.crud?.duplicates;
				if (!models) {
					onSuccess && onSuccess([]);
					return;
				}
				
				const map: Map<string, SolarMpptModel> = new Map<string, SolarMpptModel>();
				models.forEach((model: TsdbModel) => {
					let previous: SolarMpptModel = map.get(model.base);
					if (!previous) {
						previous = {
							base: model.base,
							created: model.created,
							updated: model.updated,
						};
						map.set(model.base, previous);
					}
					
					previous[model.member] = parseFloat(model.value);
				});

				onSuccess && onSuccess(Array.from( map.values() ));
			}, onError, element);
	}
}

export default new TsdbStore();
