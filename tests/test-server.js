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
		.get('/blog-posts')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');

			res.body.length.should.be.at.least(1);

			const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item){
				item.should.be.a('object');
				item.should.include.keys(expectedKeys);
			});
		});


	it('should add an item on POST', function(){
		const newItem = {title: 'blog', content: 'body here', author: 'ryan', publishDate: '05/26/16'};
		return chai.request(app);
		.post('/blog-posts')
		.send(newItem)
		.then(function(res){
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('title', 'content', 'author', 'publishDate');
			res.body.id.should.not.be.null;

			res.body.should.be.deep.equal(Object.assign(newItem, {id: res.body.id}));			})
		});
	});


	it('should update blog item on PUT', function(){
		const updateData = {
			title: 'foo',
			content: 'bar',
			author: 'me',
			publishDate: 'date'
		};

		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			updateData.id = res.body[0].id;

			return chai.request(app)
				.put(`/blog-posts/${updateData.id}`)
				.send(updateData);
		})

		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.deep.equal(updateData);
		});
	});


	it('should delete blog item on DELETE', function(){
		return chai.request(app)
		.get('/blogpost')
		.then(function(res){
			return chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}`);
		})
		.then(function(res){
			res.should.have.status(204);
		});
	});
});
