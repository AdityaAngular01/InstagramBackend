const httpUtil = require("../util/http.status.codes");
exports.internalServerError = async (request, response, error) => {	
	return response
		.status(httpUtil.INTERNAL_SERVER_ERROR.CODE)
		.json({ message: httpUtil.INTERNAL_SERVER_ERROR.MESSAGE });
};
exports.notFound = async(req, res, message)=>{
	return res
        .status(httpUtil.NOT_FOUND.CODE)
        .json({ message: message || httpUtil.NOT_FOUND.MESSAGE.BASE });
}