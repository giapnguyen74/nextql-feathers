const NeDB = require("nedb");
const service = require("feathers-nedb");

// Create a NeDB instance
const Messages = new NeDB({
	filename: "./data/messages.db",
	autoload: true
});

// Create a NeDB instance
const Users = new NeDB({
	filename: "./data/users.db",
	autoload: true
});

module.exports = {
	users: {
		feathers: {
			path: "/users",
			service: service({ Model: Users })
		},
		fields: {
			_id: 1,
			text: 1
		},
		computed: {}
	},
	messages: {
		feathers: {
			path: "/messages",
			service: service({
				Model: Messages,
				paginate: {
					default: 10,
					max: 10
				}
			})
		},
		fields: {
			_id: 1,
			text: 1,
			newText: 1
		},
		computed: {
			owner() {
				return {
					name: "Giap Nguyen Huu"
				};
			}
		}
	}
};
