# nextql-feathers
NextQL plugin for feathers. I  not sure it for production, but it demonstrate how easy to extend NextQL 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

* [NextQL](https://github.com/giapnguyen74/nextql) : Yet Another Data Query Language. Equivalent GraphQL but much more simple.
* [Featherjs](https://github.com/feathersjs/feathers) : A REST and realtime API layer for modern applications. 

> Notice: Current nextql-feathers only work with nextql >= 5.0.0

# Install
```sh
npm install --save nextql-feathers
```

# Why ?
NextQL just a data query engine. It required a client-side component, a transport and a data access component to complete. Featherjs just happen provide all of features. So shall we marry? 

In fact, NextQL match perfect with Feathers:
* NextQL use JS object as model, Feathers use JS object as service.
* NextQL's methods could map to Feathers methods.
* Finally, NextQL will complete Feathers with robust data/relationship query language.

# Sample
* [Nested services](https://github.com/giapnguyen74/nextql-feathers/tree/master/samples/posts)
* [Featherjs chat](https://github.com/giapnguyen74/nextql-feathers/tree/master/samples/chat)

# nextql + feathers = Awesome!

```js
const NextQL = require("nextql");
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

# Features
Please check out [featherjs-chat](https://github.com/giapnguyen74/nextql-feathers/tree/master/samples/chat) example with NextQL.
* NextQL could real-time over Featherjs socket.io
* Featherjs methods called with NextQL query. So you can query user information directly from messages service. Orginial version require you query addtional user service.
```js
client
		.service("messages")
		.find({
			query: {
				$params: {
					$sort: { createdAt: -1 },
					$limit: 25
				},
				total: 1,
				limit: 1,
				skip: 1,
				data: {
					text: 1,
					owner: {
						name: 1
					}
				}
			}
		})
		.then(page => {
			page.data.reverse().forEach(addMessage);
		});
```

* When you call create message, you provide NextQL query which filter data from Featherjs event - **it's work like GraphQL subscription or Relay Fat Query without coding**.
```js
client
		.service("messages")
		.create(
			{
				text: input.value
			},
			{
				query: {
					text: 1,
					owner: {
						name: 1
					}
				}
			}
		)
		.then(() => {
			input.value = "";
		});
```

* Thus event listenning from all clients will receive above NextQL query data.
```js
// Listen to created events and add the new message in real-time
client.service("messages").on("created", addMessage);
```


# Testing
```
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

File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
All files |    97.92 |    89.29 |      100 |    97.87 |                |
 index.js |    97.92 |    89.29 |      100 |    97.87 |            121 |

```


[npm-image]: https://badge.fury.io/js/nextql-feath.svg
[npm-url]: https://npmjs.org/package/nextql-feathers
[travis-image]: https://travis-ci.org/giapnguyen74/nextql-feathers.svg?branch=master
[travis-url]: https://travis-ci.org/giapnguyen74/nextql-feathers
[daviddm-image]: https://david-dm.org/giapnguyen74/nextql-feathers.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/giapnguyen74/nextql-feathers