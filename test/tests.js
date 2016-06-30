import BabelRegister from 'babel-register';
import BabelPolyfill from 'babel-polyfill';
import chai, {should, expect} from 'chai';
import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import chaiAsPromised from 'chai-as-promised';
let request = superagentPromise( superagent, Promise );

// Initialization
chai.use( chaiAsPromised );

// Constants
const url = process.env.URL || "http://lcb/api/v1";
const contentType = "application/json";
const accept = "application/json";

// Tests
describe( "Cross Origin Requests", () => {
	let result;

	before(() => {
		result = request( "OPTIONS", url )
			.set( "Origin", "http://someplace.com" )
			.end();
	});

	it( "should return the correct CORS headers", () => {
		return assert(result, "header").to.contain.all.keys([
			"access-control-allow-origin",
			"access-control-allow-methods",
			"access-control-allow-headers"
		]);
	});

	it( "should allow all origins", () => {
		return assert(result, "headers.access-control-allow-origin").to.equals("*");
	});
});

describe( "Root API Requests", () => {
	let result;

	before(() => {
		result = get(url);
	});

	it( "should return 200 HTTP status code", () => {
		return assert(result, "status").to.equal(200);
	});
});

// Useful functions
let post = (url, data) => {
	return request.post(url)
		.set( "Content-Type", contentType )
		.set( "Accept", accept )
		.send(data)
		.end();
};

let get = (url) => {
	return request.get(url)
		.set( "Accept", accept )
		.end();
};

let del = (url) => {
	return request.del(url)
		.end();
};

let update = (url, method, data) => {
	return request(method, url)
		.set( "Content-Type", contentType )
		.set( "Accept", accept )
		.send(data)
		.end();
};

let assert = (result, prop) => {
	return expect(result).to.eventually.have.deep.property(prop);
};