const svnQuestions = [{
		type: 'input',
		name: 'username',
		message: "WordPress.org username",
		validate: function validate(val) {
			return val !== '';
		},
		when: function (answers) {
			return answers.confirm;
		}
	},
	{
		type: 'password',
		message: 'WordPress.org password',
		mask: '*',
		name: 'password',
		validate: function validate(val) {
			return val !== '';
		},
		when: function (answers) {
			return answers.confirm;
		}
	},
]

module.exports = svnQuestions
