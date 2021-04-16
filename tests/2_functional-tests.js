const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	test('Translation with text and locale fields: POST request to /api/translate', (done) => {
		chai
			.request(server)
			.post('/api/translate')
			.send({
				text: 'Mangoes are my favorite fruit.',
				locale: 'american-to-british',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'should return a successful response');
				assert.equal(
					res.body.translation,
					`Mangoes are my <span class="highlight">favourite</span> fruit.`
				);
				done();
			});
	});
	test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
		chai
			.request(server)
			.post('/api/translate')
			.send({
				text: 'Translate Mangoes are my favorite fruit. to British English',
				locale: 'american-to-french',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'should return a successful response');
				assert.equal(
					res.body.error,
					'Invalid value for locale field',
					'Should return appropriate error'
				);
				done();
			});
	});
	test('Translation with missing text field: POST request to /api/translate', (done) => {
		chai
			.request(server)
			.post('/api/translate')
			.send({
				locale: 'american-to-british',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'should return a successful response');
				assert.equal(
					res.body.error,
					'Required field(s) missing',
					'Should return appropriate error'
				);
				done();
			});
	});
	test('Translation with missing locale field: POST request to /api/translate', (done) => {
		chai
			.request(server)
			.post('/api/translate')
			.send({
				text: 'Translate Mangoes are my favorite fruit. to British English',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'should return a successful response');
				assert.equal(
					res.body.error,
					'Required field(s) missing',
					'Should return appropriate error'
				);
				done();
			});
	});
	test('Translation with empty text: POST request to /api/translate', (done) => {
		chai
			.request(server)
			.post('/api/translate')
			.send({
				text: '',
				locale: 'american-to-british',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'should return a successful response');
				assert.equal(
					res.body.error,
					'No text to translate',
					'Should return appropriate error'
				);
				done();
			});
	});
	test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
		chai
			.request(server)
			.post('/api/translate')
			.send({
				text: 'Mangoes are my favorite fruit.',
				locale: 'british-to-american',
			})
			.end((err, res) => {
				assert.equal(res.status, 200, 'should return a successful response');
				assert.equal(res.body.translation, 'Everything looks good to me!');
				done();
			});
	});
});
