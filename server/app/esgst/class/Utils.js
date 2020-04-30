const CustomError = require('./CustomError');

class Utils {
	/**
	 * @param {number} timestamp
	 * @param {boolean} includeHours
	 */
	static formatDate(timestamp, includeHours) {
		const date = new Date(timestamp);
		const iso = date.toISOString();
		if (includeHours) {
			return `${iso.slice(0, 10)} ${iso.slice(11, 19)}`;
		}
		return iso.slice(0, 10);
	}

	static isSet(variable) {
		return typeof variable !== 'undefined' && variable !== null;
	}

	/**
	 * @param {number} seconds
	 */
	static async timeout(seconds) {
		return new Promise(resolve => setTimeout(resolve, seconds * 1000));
	}

	static validateParams(params, validator) {
		const paramKeys = Object.keys(params);
		const validatorKeys = Object.keys(validator);
		if (paramKeys.filter(paramKey => !validatorKeys.includes(paramKey)).length > 0) {
			throw new CustomError(`Invalid parameters. Only the following parameters are allowed: ${validatorKeys.join(', ')}`, 400);
		}
		for (const validatorKey of validatorKeys) {
			const validation = validator[validatorKey];
			if (!paramKeys.includes(validatorKey)) {
				continue;
			}
			if ((validation.check && !validation.check(params[validatorKey])) || (validation.regex && !params[validatorKey].match(validation.regex))) {
				throw new CustomError(`Invalid ${validatorKey} parameter. ${validation.message}`, 400);
			}
			if (validation.transform) {
				params[validatorKey] = validation.transform(params[validatorKey]);
			}
			if (!validation.conflicts) {
				continue;
			}
			const intersection = paramKeys.filter(paramKey => validation.conflicts.includes(paramKey));
			if (intersection.length > 0) {
				throw new CustomError(`Invalid parameters. The following parameters are conflicting with each other: ${validatorKey}, ${intersection.join(', ')}`, 400);
			}
		}
	}
}

module.exports = Utils;