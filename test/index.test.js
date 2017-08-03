const NextQL = require("../../nextql");
const nextql = new NextQL();
const feathers = require("feathers");
const app = feathers();
const NeDB = require("nedb");
const service = require("feathers-nedb");

// Create a NeDB instance
const Model = new NeDB({
	filename: "./data/messages.db",
	autoload: true
});

nextql.use(require("../src"), {
	app
});

nextql.model("messages", {
	feathers: {
		path: "/messages",
		service: service({ Model })
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
});

beforeAll(() => {
	return new Promise(function(ok) {
		Model.insert(
			[
				{
					_id: 1,
					text: "Text 1"
				},
				{ _id: 2, text: "Text 2" }
			],
			() => ok()
		);
	});
});

afterAll(() => {
	return new Promise(function(ok) {
		Model.remove({}, { multi: true }, () => ok());
	});
});

test("find messages", async () => {
	const messages = await app.service("messages").find({
		query: {
			$params: { $limit: 2 },
			_id: 1,
			text: 1,
			owner: {
				name: 1
			}
		}
	});
	expect(messages.length).toBe(2);
	expect(messages[0].owner.name).toBe("Giap Nguyen Huu");
});

test("get message", async () => {
	const message = await app.service("messages").get(1, {
		query: {
			_id: 1,
			text: 1,
			owner: {
				name: 1
			}
		}
	});

	expect(message).toMatchObject({
		_id: 1,
		text: "Text 1",
		owner: {
			name: "Giap Nguyen Huu"
		}
	});
});

test("create message", async () => {
	const message = await app.service("messages").create(
		{
			_id: 3,
			text: "Text 3"
		},
		{
			query: {
				_id: 1,
				text: 1,
				owner: {
					name: 1
				}
			}
		}
	);

	expect(message).toMatchObject({
		_id: 3,
		text: "Text 3",
		owner: {
			name: "Giap Nguyen Huu"
		}
	});
});

test("update message", async () => {
	await app.service("messages").update(
		1,
		{
			text: "Update text 1"
		},
		{
			query: {}
		}
	);

	const message = await app.service("messages").get(1, {
		query: {
			_id: 1,
			text: 1,
			owner: {
				name: 1
			}
		}
	});

	expect(message).toMatchObject({
		_id: 1,
		text: "Update text 1",
		owner: {
			name: "Giap Nguyen Huu"
		}
	});
});

test("patch message", async () => {
	await app.service("messages").patch(
		2,
		{
			newText: "Text 2"
		},
		{
			query: {}
		}
	);

	const message = await app.service("messages").get(2, {
		query: {
			_id: 1,
			text: 1,
			newText: 1,
			owner: {
				name: 1
			}
		}
	});

	expect(message).toMatchObject({
		_id: 2,
		text: "Text 2",
		newText: "Text 2",
		owner: {
			name: "Giap Nguyen Huu"
		}
	});
});

test("remove message", async () => {
	await app.service("messages").remove(3, {
		query: {}
	});

	await app
		.service("messages")
		.get(3, {
			query: {
				_id: 1,
				text: 1,
				newText: 1,
				owner: {
					name: 1
				}
			}
		})
		.catch(err => expect(err.message).toBe("No record found for id '3'"));
});
