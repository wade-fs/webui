export function getCustomizeData(fields, data) {
	let customizeData = {};
	fields.forEach(field => {
		if (data.hasOwnProperty(field)) {
			customizeData[field] = data[field];
		}
	});
	return customizeData;
}