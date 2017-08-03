const NextQL = require("../../../nextql");
const nextql = new NextQL();
const models = require("./models");
module.exports = function() {
	nextql.use(require("../../src"), {
		app: this
	});

	Object.keys(models).forEach(k => nextql.model(k, models[k]));
};
