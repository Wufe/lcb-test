import BabelRegister from 'babel-register';
import BabelPolyfill from 'babel-polyfill';
import chai, {should, expect} from 'chai';
import shared from 'mocha-shared';
import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import * as http from './lib/http';
import * as constants from './lib/constants';
import mochaAsync from './lib/async';
let request = superagentPromise( superagent, Promise );
chai.use( chaiAsPromised );

describe( "Server Tests", () => {
	describe( "Authentication", () => {
		it( 'should create a test account', mochaAsync( async () => {
			let result = await http.put( `${constants.host}/test/v1` );
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property('result');
		}));

		describe( "Basic auth", () => {
			it( 'should fail login with wrong password', mochaAsync( async () => {
				let result;
				try{
					result = await request.post( `${constants.host}/test/v1/auth` )
									.auth( "test@test.net", "test1o" )
									.end();
				}catch( e ){
					result = e.response;
				}
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
			}));

			it( 'should fail login with wrong email', mochaAsync( async () => {
				let result;
				try{
					result = await request.post( `${constants.host}/test/v1/auth` )
									.auth( "test@test.com", "test1" )
									.end();
				}catch( e ){
					result = e.response;
				}
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
			}));

			it( 'should pass login with right credentials', mochaAsync( async () => {
				let result = await request.post( `${constants.host}/test/v1/auth` )
									.auth( "test@test.net", "test1" )
									.end();
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("result").to.equal("success");
			}));
		});

		describe( "Cookie auth", () => {
			it( 'should fail login with wrong token', mochaAsync( async () => {
				let result;
				try{
					result = await request.post( `${constants.host}/test/v1/auth` )
									.set( "Cookie", "auth=123" )
									.end();
				}catch( e ){
					result = e.response;
				}
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
			}));

			let authToken = null;

			before(mochaAsync( async () => {
					let authResponse = await request.post( `${constants.host}/test/v1/auth` )
									.auth( "test@test.net", "test1" )
									.end();
					authToken = authResponse.body.payload;
				}));

			it( `should pass login with right token`, mochaAsync( async () => {
				let result = await request.post( `${constants.host}/test/v1/auth` )
									.set( "Cookie", `auth=${authToken}` )
									.end();
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("result").to.equal("success");
			}));
		});

		describe( "Body data auth", () => {
			it( 'should fail login with wrong token', mochaAsync( async () => {
				let result;
				try{
					result = await request.post( `${constants.host}/test/v1/auth` )
									.send({ auth: '123' })
									.end();
				}catch( e ){
					result = e.response;
				}
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
			}));

			let authToken = null;

			before(mochaAsync( async () => {
					let authResponse = await request.post( `${constants.host}/test/v1/auth` )
									.auth( "test@test.net", "test1" )
									.end();
					authToken = authResponse.body.payload;
				}));

			it( `should pass login with right token`, mochaAsync( async () => {
				let result = await request.post( `${constants.host}/test/v1/auth` )
									.send({ auth: authToken })
									.end();
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("result").to.equal("success");
			}));
		});

		describe( "OAuth", () => {
			it( 'should fail login with wrong token', mochaAsync( async () => {
				let result;
				try{
					result = await request.post( `${constants.host}/test/v1/auth` )
									.set('Authorization', `Bearer 123`)
									.end();
				}catch( e ){
					result = e.response;
				}
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
			}));

			let authToken = null;

			before(mochaAsync( async () => {
					let authResponse = await request.post( `${constants.host}/test/v1/auth` )
									.auth( "test@test.net", "test1" )
									.end();
					authToken = authResponse.body.payload;
				}));

			it( `should pass login with right token`, mochaAsync( async () => {
				let result = await request.post( `${constants.host}/test/v1/auth` )
									.set('Authorization', `Bearer ${authToken}`)
									.end();
				
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("result").to.equal("success");
			}));
		});
	});

	describe( "Datastore", () => {
		describe( "Storage persistance", () => {
			let result = null;

			before(mochaAsync( async () => {
				result = await request.get( `${constants.host}/test/v1/datastore` )
									.set( "Content-Type", constants.contentType )
									.end();
			}));

			it( "should be successful", () => {
				expect(result.body).to.be.json;
				expect(result.body).to.have.deep.property("result").to.equal("success");
			});

			it( "should get instance of DatastoreHandler", () => {
				expect(result.body.payload).to.have.deep.property("1st").to.have.deep.property("outcome").to.equal("passed.");
			});

			it( "should be able to instantiate an object instance of DatastoreAdapter", () => {
				expect(result.body.payload).to.have.deep.property("2nd").to.have.deep.property("outcome").to.equal("passed.");
			});

			it( "should pass the connection check", () => {
				expect(result.body.payload).to.have.deep.property("3rd").to.have.deep.property("outcome").to.equal("passed.");
			});

			it( "should store and retrieve value without losing data", () => {
				expect(result.body.payload).to.have.deep.property("4th").to.have.deep.property("outcome").to.equal("passed.");
			});
		});
	});
});