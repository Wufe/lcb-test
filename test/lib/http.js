import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
let request = superagentPromise( superagent, Promise );
import * as constants from './constants';

// Useful functions
export let post = (url, data, fn) => {
	return request.post(url)
		.set( "Content-Type", constants.contentType )
		.set( "Accept", constants.accept )
		.send(data)
		.end(fn);
};

export let put = (url, data, fn) => {
	return request.put(url)
		.set( "Content-Type", constants.contentType )
		.set( "Accept", constants.accept )
		.send(data)
		.end(fn);
};

export let get = (url, fn) => {
	return request.get(url)
		.set( "Accept", constants.accept )
		.end(fn);
};

export let del = (url) => {
	return request.del(url)
		.end();
};

export let update = (url, method, data) => {
	return request(method, url)
		.set( "Content-Type", constants.contentType )
		.set( "Accept", constants.accept )
		.send(data)
		.end();
};