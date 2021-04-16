const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

const americanToBritish = Object.entries({
	...americanToBritishSpelling,
	...americanOnly,
}).sort((a, b) => {
	return b[0].length - a[0].length;
});

const britishToAmerican = [
	...Object.entries(britishOnly),
	...Object.entries(americanToBritishSpelling).map((entry) => entry.reverse()),
].sort((a, b) => {
	return b[0].length - a[0].length;
});

const services = ['american-to-british', 'british-to-american'];

class Translator {
	validator({ text, locale }) {
		if (text === undefined || locale === undefined) {
			return 'Required field(s) missing';
		} else if (!text) {
			return 'No text to translate';
		} else if (!services.find((trans) => trans === locale)) {
			return 'Invalid value for locale field';
		}
		return false;
	}

	convertTime(text, from, to) {
		const timeInstances = text.match(/([1-9]|1[012])[:.][0-5][0-9]/g);

		if (timeInstances) {
			timeInstances.map((t) => {
				const newTime = t.replace(from, to);
				return (text = text.replace(
					t,
					`<span class="highlight">${newTime}</span>`
				));
			});
		}

		return text;
	}

	swapWords(text, [oldWord, newWord]) {
		const regex = new RegExp(oldWord + `[^a-z]`, 'gi');

		const wordExists = text.match(regex);

		if (wordExists) {
			wordExists.map((word) => {
				return (text = text.replace(
					word,
					`<span class="highlight">${newWord}</span>${word.slice(
						word.length - 1
					)}`
				));
			});
		}
		return text;
	}
	swapTitles(text, [oldWord, newWord]) {
		const regex = new RegExp(oldWord + ' ', 'gi');

		const wordExists = text.match(regex);

		const result = newWord.slice(0, 1).toUpperCase() + newWord.slice(1);

		if (wordExists) {
			text = text.replace(regex, `<span class="highlight">${result}</span> `);
		}
		return text;
	}
	americanToBritish(text) {
		americanToBritish.map((word) => {
			text = this.swapWords(text, word);
		});
		Object.entries(americanToBritishTitles).map((word) => {
			text = this.swapTitles(text, word);
		});
		text = this.convertTime(text, ':', '.');

		return text;
	}

	britishToAmerican(text) {
		britishToAmerican.map((word) => {
			text = this.swapWords(text, word);
		});
		Object.entries(americanToBritishTitles).map((word) => {
			text = this.swapTitles(text, word.reverse());
		});
		text = this.convertTime(text, '.', ':');
		return text;
	}

	translate({ text, locale }) {
		const result =
			locale === services[0]
				? this.americanToBritish(text)
				: this.britishToAmerican(text);

		return result === text ? 'Everything looks good to me!' : result;
	}
}

module.exports = Translator;
