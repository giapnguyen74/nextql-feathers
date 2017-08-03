const feathers = require("feathers");
const bodyParser = require("body-parser");
const rest = require("feathers-rest");
const socketio = require("feathers-socketio");
const app = feathers();
const path = require("path");
// Turn on JSON parser for REST services
app.use(bodyParser.json());
// Turn on URL-encoded parser for REST services
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", feathers.static(path.join(__dirname, "public")));

// Set up REST transport
app.configure(rest());
app.configure(socketio());
app.configure(require("./app"));

app.listen(3000, function() {
	console.log("chat server@3000");
});
