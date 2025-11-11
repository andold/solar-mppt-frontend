// TsdbModel.ts
export default interface TsdbModel {
	id: number;
	group: string;
	member: string;
	base: string;
	value: string;

	created: string;
	updated: string;
	
	// not support field. user custom.
	custom: any;
}
