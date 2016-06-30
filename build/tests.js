'use strict';

var _babelRegister = require('babel-register');

var _babelRegister2 = _interopRequireDefault(_babelRegister);

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentPromise = require('superagent-promise');

var _superagentPromise2 = _interopRequireDefault(_superagentPromise);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = (0, _superagentPromise2.default)(_superagent2.default, Promise);

// Initialization
_chai2.default.use(_chaiAsPromised2.default);

// Constants
var url = process.env.URL || "http://lcb/api/v1";
var contentType = "application/json";
var accept = "application/json";

// Tests
describe("Cross Origin Requests", function () {
	var result = void 0;

	before(function () {
		result = request("OPTIONS", url).set("Origin", "http://someplace.com").end();
	});

	it("should return the correct CORS headers", function () {
		return assert(result, "header").to.contain.all.keys(["access-control-allow-origin", "access-control-allow-methods", "access-control-allow-headers"]);
	});

	it("should allow all origins", function () {
		return assert(result, "headers.access-control-allow-origin").to.equals("*");
	});
});

// Useful functions
var post = function post(url, data) {
	return request.post(url).set("Content-Type", contentType).set("Accept", accept).send(data).end();
};

var get = function get(url) {
	return request.get(url).set("Accept", accept).end();
};

var del = function del(url) {
	return request.del(url).end();
};

var update = function update(url, method, data) {
	return request(method, url).set("Content-Type", contentType).set("Accept", accept).send(data).end();
};

var assert = function assert(result, prop) {
	return (0, _chai.expect)(result).to.eventually.have.deep.property(prop);
};
