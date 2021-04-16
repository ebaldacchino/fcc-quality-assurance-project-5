'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
	const translator = new Translator();

	app.route('/api/translate').post(({ body }, res) => {
		const { text } = body;

		const error = translator.validator(body);

		if (error) {
			return res.status(200).json({ error });
		}

		const result = translator.translate(body);

		return res.status(200).json({ text, translation: result });
	});
};
