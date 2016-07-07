import BabelRegister from 'babel-register';
import BabelPolyfill from 'babel-polyfill';
import chai, {should, expect} from 'chai';
import shared from 'mocha-shared';
import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import chaiAsPromised from 'chai-as-promised';
import * as http from '../lib/http';
import * as constants from '../lib/constants';
import mochaAsync from '../lib/async';
let request = superagentPromise( superagent, Promise );

// Initialization
chai.use( chaiAsPromised );

let allCORSHeaders = (result, done) => {	
	expect(result).to.have.deep.property("header").to.contain.all.keys([
			"access-control-allow-origin",
			"access-control-allow-methods",
			"access-control-allow-headers"
		]);
	done();
};

let CORSOrigin = (result, done) => {
	expect(result).to.have.deep.property("headers.access-control-allow-origin").to.equals("*");
	done();
};

let status200 = (result, done) => {
	expect(result).to.have.deep.property("status").to.equal(200);
	done();
};

let jsonResponse = (result, done) => {
	expect(result).to.have.deep.property("body").to.be.json;
	done();
};

let standardJsonResponse = (result, done) => {
	it( "should be a json object", () => {
		return expect(result).to.be.json;
	});

	it( "should have status 200 HTTP status code", () => {
		return expect(result, "status").to.equal(200);
	});
};

// Tests
describe( "Public API Tests", () => {
	describe( "Cross Origin Requests", () => {
		let result;

		before((done) => {
			request( "OPTIONS", constants.url )
				.set( "Origin", "http://someplace.com" )
				.end((err, res) => {
					result = res;
					done();
				});
		});

		it( "should have all CORS headers", (done) => {
			allCORSHeaders(result, done);
		});

		it( "should allow any origin", (done) => {
			CORSOrigin(result, done);
		});

		it( "should return 200 status code", (done) => {
			status200(result, done);
		});

		it( "should return a json object", (done) => {
			jsonResponse(result, done);
		});
	});

	describe( "Root API Requests", () => {
		let result;

		before((done) => {
			request( "OPTIONS", constants.url )
				.set( "Origin", "http://someplace.com" )
				.end((err, res) => {
					result = res;
					done();
				});
		});

		it( "should have all CORS headers", (done) => {
			allCORSHeaders(result, done);
		});

		it( "should allow any origin", (done) => {
			CORSOrigin(result, done);
		});

		it( "should return 200 status code", (done) => {
			status200(result, done);
		});

		it( "should return a json object", (done) => {
			jsonResponse(result, done);
		});
	});

	describe( "Logged User Access Functions", () => {
		let result;

		before((done) => {
			result = http.get( `${constants.url}/user`, (err, res) => {
				result = res;
				done();
			});
		});

		it( "should have all CORS headers", (done) => {
			allCORSHeaders(result, done);
		});

		it( "should allow any origin", (done) => {
			CORSOrigin(result, done);
		});

		it( "should return 200 status code", (done) => {
			status200(result, done);
		});

		it( "should return a json object", (done) => {
			jsonResponse(result, done);
		});

		it( "should be a failure request", () => {
			return expect(result).to.have.deep.property("body.result").to.equals("fail");
		});

		it( "should have error code -29 ( not authenticated )", () => {
			return expect(result).to.have.deep.property("body.code").to.equals( -29 );
		});
	});
});