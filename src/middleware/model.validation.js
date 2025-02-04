const JOI = require("joi");

const ValidateJoi = (schema) => {
	return async (request, response, next) => {
		try {
			await schema.validateAsync(request.body);
			next();
		} catch (error) {
			console.log(error);
			return response
				.status(422)
				.json({ message: error.details[0].message });
		}
	};
};

const Schemas = {
	// User Schema Validator
	userSchema: JOI.object({
		username: JOI.string().alphanum().min(3).required().messages({
			"string.base": "Username must be a string",
			"string.empty": "Username cannot be empty",
			"string.min": "Username must be at least 3 characters long",
			"string.alphanum":
				"Username must only contain alphanumeric characters",
			"any.required": "Username is a required.",
		}),
		email: JOI.string().email().required().messages({
			"string.email": "Email must be a valid email address",
			"string.empty": "Email cannot be empty",
			"string.base": "Email must be a string",
			"any.required": "Email is a required.",
		}),
		password: JOI.string()
			.min(8)
			.max(50)
			.pattern(
				new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")
			)
			.required()
			.messages({
				"string.base": "Password must be a valid string.",
				"string.empty": "Password is required.",
				"string.min": "Password must be at least 8 characters long.",
				"string.max": "Password cannot exceed 50 characters.",
				"string.pattern.base":
					"Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
				"any.required": "Password is a required.",
			}),
		fullName: JOI.string()
			.pattern(new RegExp("^[a-zA-Z ]+$"))
			.min(3)
			.max(25)
			.required()
			.messages({
				"string.empty": "Full Name cannot be empty",
				"string.base": "Full Name must be a string",
				"string.min": "Full Name must be at least 3 characters long",
				"string.pattern.base":
					"Full Name must only contain alphabetic characters and spaces",
				"string.max": "Full Name must be at most 25 characters long",
				"any.required": "Full Name is a required.",
			}),
		// profilePicture: JOI.optional(),
		// followers: JOI.array().items(
		// 	JOI.string().optional().pattern(new RegExp("^[0-9a-fA-F]{24}$/"))
		// ),
		// following: JOI.array().items(
		// 	JOI.string().optional().pattern(new RegExp("^[0-9a-fA-F]{24}$/"))
		// ),
		// posts: JOI.array().items(
		// 	JOI.string().optional().pattern(new RegExp("^[0-9a-fA-F]{24}$/"))
		// ),
		// isActive: JOI.boolean().optional(),
	}),

	//Auth Login Validations
	userLogin: JOI.object({
		loginWith: JOI.string().valid("email", "username").required().messages({
			"string.base": "Login with must be a string",
			"string.empty": "Login with cannot be empty",
			"string.valid": "Login with must be either 'email' or 'username'",
			"any.required": "Login with is a required.",
		}),
		username: JOI.string().when("loginWith", {
			is: "username",
			then: JOI.string().required().messages({
				"string.base": "Username must be a string",
				"string.empty": "Username cannot be empty",
				"any.required": "Username is a required.",
			}),
		}),
		email: JOI.string().when("loginWith", {
			is: "email",
			then: JOI.string().email().required().messages({
				"string.base": "Email must be a valid email address",
				"string.empty": "Email cannot be empty",
				"string.email": "Email must be a valid email address",
				"any.required": "Email is a required.",
			}),
		}),
		password: JOI.string().min(8).required().messages({
			"string.base": "Password must be a valid string.",
			"string.empty": "Password is required.",
			"string.min": "Password must be at least 8 characters long.",
			"any.required": "Password is a required.",
		}),
	}),
	//User Update Profile
	updateProfile: JOI.object({
		update: JOI.string()
			.valid("fullName", "bio", "profilePicture")
			.required(),
		fullName: JOI.string().when("update", {
			is: "fullName",
			then: JOI.string()
				.min(3)
				.max(25)
				.pattern(new RegExp("^[a-zA-Z ]+$"))
				.required()
				.messages({
					"string.empty": "Full Name cannot be empty",
					"string.base": "Full Name must be a string",
					"string.min":
						"Full Name must be at least 3 characters long",
					"string.pattern.base":
						"Full Name must only contain alphabetic characters and spaces",
					"string.max":
						"Full Name must be at most 25 characters long",
					"any.required": "Full Name is a required.",
				}),
		}),
		bio: JOI.string().when("update", {
			is: "bio",
			then: JOI.string().min(5).max(30).required().messages({
				"string.empty": "Bio cannot be empty",
				"string.base": "Bio must be a string",
				"string.min": "Bio must be at least 5 characters long",
				"string.max": "Bio must be at most 30 characters long",
				"any.required": "Bio is a required.",
			}),
		}),
		profilePicture: JOI.string().when("update", {
			is: "profilePicture",
			then: JOI.string().required().messages({
				"string.empty": "Profile Picture cannot be empty",
				"string.base": "Profile Picture must be a string",
				"any.required": "Profile Picture is a required.",
			}),
		}),
	}),

	//Search User
	searchUser: JOI.object({
		by: JOI.string().valid("username", "fullName").required().messages({
			"string.base": "Search By must be a string",
			"string.empty": "Search By cannot be empty",
			"string.valid":
				"Search By must be either 'Username' or 'Full Name'",
			"any.required": "Search By is a required.",
		}),
		username: JOI.string().when("by", {
			is: "username",
			then: JOI.string().min(1).required().messages({
				"string.empty": "Username cannot be empty",
				"string.base": "Username must be a string",
				"string.min": "Username must be at least 1 character long",
				"any.required": "Username is a required.",
			}),
			otherwise: JOI.forbidden(), // Disallow 'username' when 'by' is not 'username'
		}),
		fullName: JOI.string().when("by", {
			is: "fullName",
			then: JOI.string()
				.min(1)
				.pattern(new RegExp("^[a-zA-Z ]+$"))
				.required()
				.messages({
					"string.empty": "Full Name cannot be empty",
					"string.base": "Full Name must be a string",
					"string.min": "Full Name must be at least 1 character long",
					"string.pattern.base":
						"Full Name must only contain alphabetic characters and spaces",
					"any.required": "Full Name is a required.",
				}),
			otherwise: JOI.forbidden(), // Disallow 'fullName' when 'by' is not 'fullName'
		}),
	}) .oxor("username", "fullName") // Ensures that only one of them is present
  .messages({
    "object.oxor": '"username" or "fullName" must be provided, not both',
  }),
};

module.exports = { ValidateJoi, Schemas };
