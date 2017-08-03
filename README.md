# nextql-feathers
NextQL plugin for feathers. I  not sure it for production, but it demonstrate how easy to extend NextQL 

* [NextQL](https://github.com/giapnguyen74/nextql)
* [Featherjs](https://github.com/feathersjs/feathers)

# Why ?
NextQL just a data query engine. It required a client-side component, a transport and a data access component to complete. Featherjs just happen provide all of features. So shall we marry? 

In fact, NextQL match perfect with Feathers:
* NextQL use JS object as model, Feathers use JS as service.
* NextQL's methods could map to Feathers methods.
* Finally, NextQL will complete Feathers with robust data/relationship query language.

# nextql + feathers = Awesome!

```js
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

// Use nextql-feathers plugin 
nextql.use(require("nextql-feathers"), {
	app
});

// Define NextQL model which also a feathers service
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


// Now NextQL work seamlessly with Feathers
await app.service("messages").find({
		query: {
			$params: { $limit: 2 }, // featherjs find params
			_id: 1,
			text: 1,
			owner: {
				name: 1 // !!! NextQL resolve computed value for featherjs
			}
		}
	})

await app.service("messages").get(1, {
		query: {
			_id: 1,
			text: 1,
			owner: {
				name: 1
			}
		}
	});


await app.service("messages").patch(
		2,
		{
			newText: "Text 2"
		},
		{
			query: {}
		}
	);
```


# Testing
 PASS  test/index.test.js
  ✓ find messages (8ms)
  ✓ get message (5ms)
  ✓ create message (2ms)
  ✓ update message (5ms)
  ✓ patch message (2ms)
  ✓ remove message (3ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.908s, estimated 2s
Ran all test suites.
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
All files |    97.92 |    89.29 |      100 |    97.87 |                |
 index.js |    97.92 |    89.29 |      100 |    97.87 |            121 |
----------|----------|----------|----------|----------|----------------|