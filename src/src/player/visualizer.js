// thanks, https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/
// and https://codepen.io/andrewscofield/pen/oGyrEv

const Visualizer = (function () {

	const svg = document.querySelector('#wave');
	const clipPath = svg.querySelector('clipPath');
	const gradientStops = [...document.querySelectorAll('#progress-gradient stop')];

	const config = {
		SAMPLE_COUNT: 103,
		WIDTH: 2,
		MAX_HEIGHT: 70,
		GAP: 5,
	}

	function sample(buffer) {
		return new Promise(async resolve => {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;

			const audioBuffer = await (new AudioContext()).decodeAudioData(buffer);
			const channelData = audioBuffer.getChannelData(0);

			const blockSize = Math.floor(channelData.length / config.SAMPLE_COUNT);
			const samples = [];
			for (let i = 0; i < config.SAMPLE_COUNT; i++) samples.push(channelData[i * blockSize]);

			resolve(samples);
		});
	}

	function normalize(samples) {
		samples = samples.map(s => Math.abs(s));
		const multiplier = Math.pow(Math.max(...samples), -1) * config.MAX_HEIGHT;
  		return samples.map(s => s * multiplier);
	}

	async function generate(buffer) {

		svg.classList.remove('done');

		const samples = await sample(buffer);
		const normalized = normalize(samples);

		clipPath.innerHTML = '';
		normalized.forEach((s, i) => {
			const x = i * config.GAP;
			const line = `<rect x="${x}" y="0" height="${s}" width="${config.WIDTH}" fill="#000"></rect>`;
			clipPath.insertAdjacentHTML('beforeend', line);
		});

		svg.classList.add('done');
	}

	function setProgress(progress) {
		gradientStops.forEach(s => s.setAttribute('offset', progress * 100 + '%'));
	}

	return {
		generate: generate,
		setProgress: setProgress
	}

})();


// test function
function loadFile(target) {
	const reader = new FileReader();
	reader.readAsArrayBuffer(target.files[0]);
	reader.onload = function (event) {
		Visualizer.generate(event.target.result);
	}
}