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
								.set( "Content-Type", constants.contentType )
								.auth( "test@test.net", "testo" )
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
								.set( "Content-Type", constants.contentType )
								.auth( "test@test.com", "test" )
								.end();
			}catch( e ){
				result = e.response;
			}
			
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property("status").to.equal("HTTP/1.1 401 Unauthorized");

		}));

		it( 'should pass login with right credentials', mochaAsync( async () => {
			let result = await request.post( `${constants.host}/test/v1/auth` )
								.set( "Content-Type", constants.contentType )
								.auth( "test@test.net", "test" )
								.end();
			
			expect(result.body).to.be.json;
			expect(result.body).to.have.deep.property("result").to.equal("success");

		}));

	});

	

});