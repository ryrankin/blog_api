const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server.js');
const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function(){
	
	before(function(){
		return runServer();
	});



	after(function(){
		return closeServer();
	});

	it('should get blog-post items on GET', function(){
		return chai.request(app)
		.get()
	})

});

