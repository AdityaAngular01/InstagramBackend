const { httpStatusCodesUtils: httpUtil } = require("nodejs-utility-package");

const httpStatus = {
	INTERNAL_SERVER_ERROR: {
		CODE: httpUtil.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
		MESSAGE: httpUtil.getStatusMessage(
			httpUtil.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
		),
	},
	NOT_FOUND: {
		CODE: httpUtil.HTTP_STATUS_CODES.NOT_FOUND,
		MESSAGE: {
			BASE: httpUtil.getStatusMessage(
				httpUtil.HTTP_STATUS_CODES.NOT_FOUND
			),
			POST: "Post not found or unauthorized",
		},
	},
	UNAUTHORIZED: {
		CODE: httpUtil.HTTP_STATUS_CODES.UNAUTHORIZED,
		MESSAGE: httpUtil.getStatusMessage(
			httpUtil.HTTP_STATUS_CODES.UNAUTHORIZED
		),
	},
	CREATED: {
		CODE: httpUtil.HTTP_STATUS_CODES.CREATED,
		MESSAGE: httpUtil.getStatusMessage(httpUtil.HTTP_STATUS_CODES.CREATED),
	},
	FOUND: {
		CODE: httpUtil.HTTP_STATUS_CODES.FOUND,
		MESSAGE: httpUtil.getStatusMessage(httpUtil.HTTP_STATUS_CODES.FOUND),
	},
	OK: {
		CODE: httpUtil.HTTP_STATUS_CODES.OK,
		MESSAGE: httpUtil.getStatusMessage(httpUtil.HTTP_STATUS_CODES.OK),
	},
	BAD_REQUEST: {
		CODE: httpUtil.HTTP_STATUS_CODES.BAD_REQUEST,
		MESSAGE: httpUtil.getStatusMessage(
			httpUtil.HTTP_STATUS_CODES.BAD_REQUEST
		),
	},
};

module.exports = httpStatus;
