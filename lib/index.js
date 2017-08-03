"use strict";

/**
 * @example <caption>Extend nextql model with featherjs option</caption>
 * // {
 * // 	feathers: 'path'
 * // }
 */

class Service {
	constructor(options) {
		const name = options.name,
		      nextql = options.nextql;


		this.name = name;
		this.nextql = nextql;
	}

	_execute(method, query, params) {
		const q = {};
		q[this.name] = {};
		q[this.name][method] = query;
		return this.nextql.execute(q, params) //featherjs params as context
		.then(result => result && result[this.name] && result[this.name][method] || {});
	}

	find(params) {
		const query = Object.assign({}, params && params.query);
		return this._execute("find", query, params);
	}

	get(id, params) {
		const query = Object.assign({}, params && params.query);
		query.$params = { id };
		return this._execute("get", query, params);
	}

	create(data, params) {
		const query = Object.assign({}, params && params.query);
		query.$params = { data };
		return this._execute("create", query, params);
	}

	update(id, data, params) {
		const query = Object.assign({}, params && params.query);
		query.$params = { id, data };
		return this._execute("update", query, params);
	}

	patch(id, data, params) {
		const query = Object.assign({}, params && params.query);
		query.$params = { id, data };
		return this._execute("patch", query, params);
	}

	remove(id, params) {
		const query = Object.assign({}, params && params.query);
		query.$params = { id };
		return this._execute("remove", query, params);
	}
}

function inject_feather_methods(name, options, service) {
	const handleResult = result => {
		return Array.isArray(result) ? result.map(obj => Object.assign(obj, {
			_type: name
		})) : Object.assign(result, {
			_type: name
		});
	};
	options.methods = Object.assign({
		find(params, ctx) {
			return service.find({
				query: ctx.query.$params
			}).then(handleResult);
		},

		get(params, ctx) {
			return service.get(params.id, ctx).then(handleResult);
		},

		create(params, ctx) {
			return service.create(params.data, ctx).then(handleResult);
		},

		update(params, ctx) {
			return service.update(params.id, params.data, ctx).then(handleResult);
		},

		patch(params, ctx) {
			return service.patch(params.id, params.data, ctx).then(handleResult);
		},

		remove(params, ctx) {
			return service.remove(params.id, ctx).then(handleResult);
		}
	}, options.methods);
}

module.exports = {
	install(nextql, options) {
		const app = options && options.app;
		if (!app) {
			throw new Error("Missing feathers app object");
		}

		nextql.afterResolveType(source => source && source._type);

		nextql.beforeCreate(options => {
			const name = options.name;
			if (options.feathers) {
				var _options$feathers = options.feathers;
				const path = _options$feathers.path,
				      service = _options$feathers.service;

				app.use(path, new Service({
					name: options.name,
					nextql
				}));

				if (service) {
					inject_feather_methods(name, options, service);
				}
			}
		});
	}
};