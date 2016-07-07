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

describe( "User Login /user/login POST", () => {
	it( 'should create a test account', mochaAsync( async () => {
		let result = await http.put( `${constants.host}/test/v1` );
		expect(result.body).to.be.json;
		expect(result.body).to.have.deep.property('result');
	}));

	describe( "Default auth", () => {
		it( 'should fail login with wrong password', mochaAsync( async () => {
			let result;
			try{
				result = await request.post( `${constants.url}/user/login` )
								.send({ email: "test@test.net", password: "test1o" })
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
				result = await request.post( `${constants.url}/user/login` )
								.send({ email: "test@test.com", password: "test1" })
								.end();
			}catch( e ){
				result = e.response;
			}
			
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
		}));

		it( 'should pass login with right credentials', mochaAsync( async () => {
			let result = await request.post( `${constants.url}/user/login` )
								.send({ email: "test@test.net", password: "test1" })
								.end();
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property("result").to.equal("success");
		}));
	});

	describe( "Basic auth", () => {
		it( 'should fail login with wrong password', mochaAsync( async () => {
			let result;
			try{
				result = await request.post( `${constants.url}/user/login` )
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
				result = await request.post( `${constants.url}/user/login` )
								.auth( "test@test.com", "test1" )
								.end();
			}catch( e ){
				result = e.response;
			}
			
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");
		}));

		it( 'should pass login with right credentials', mochaAsync( async () => {
			let result = await request.post( `${constants.url}/user/login` )
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
				result = await request.post( `${constants.url}/user/login` )
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
				let authResponse = await request.post( `${constants.url}/user/login` )
								.auth( "test@test.net", "test1" )
								.end();
				authToken = authResponse.body.payload;
			}));

		it( `should pass login with right token`, mochaAsync( async () => {
			let result = await request.post( `${constants.url}/user/login` )
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
				result = await request.post( `${constants.url}/user/login` )
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
				let authResponse = await request.post( `${constants.url}/user/login` )
								.auth( "test@test.net", "test1" )
								.end();
				authToken = authResponse.body.payload;
			}));

		it( `should pass login with right token`, mochaAsync( async () => {
			let result = await request.post( `${constants.url}/user/login` )
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
				result = await request.post( `${constants.url}/user/login` )
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
				let authResponse = await request.post( `${constants.url}/user/login` )
								.auth( "test@test.net", "test1" )
								.end();
				authToken = authResponse.body.payload;
			}));

		it( `should pass login with right token`, mochaAsync( async () => {
			let result = await request.post( `${constants.url}/user/login` )
								.set('Authorization', `Bearer ${authToken}`)
								.end();
			
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property("result").to.equal("success");
		}));
	});
});