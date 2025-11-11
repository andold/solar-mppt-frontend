// SolarMpptModel.ts
export default interface SolarMpptModel {
	id?: number;
	base: string;

	temperature?: number;
	temperatureMin?: number;
	discharge?: number;
	charge?: number;
	voltage?: number;
	voltageMin?: number;

	created: string;
	updated: string;
	
	// not support field. user custom.
	custom?: any;
}
