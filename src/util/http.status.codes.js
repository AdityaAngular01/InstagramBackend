const {httpStatusCodesUtils: httpUtil} = require('nodejs-utility-package');

const httpStatus = {
	INTERNAL_SERVER_ERROR: {
		CODE: httpUtil.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
		MESSAGE: httpUtil.getStatusMessage(
			httpUtil.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
		),
	},
    NOT_FOUND:{
        CODE: httpUtil.HTTP_STATUS_CODES.NOT_FOUND,
        MESSAGE: httpUtil.getStatusMessage(
            httpUtil.HTTP_STATUS_CODES.NOT_FOUND
        ),
    },
    UNAUTHORIZED:{
        CODE: httpUtil.HTTP_STATUS_CODES.UNAUTHORIZED,
        MESSAGE: httpUtil.getStatusMessage(
            httpUtil.HTTP_STATUS_CODES.UNAUTHORIZED
        ),
    }
};

module.exports = httpStatus;