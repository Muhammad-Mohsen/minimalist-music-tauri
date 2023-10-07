// thanks, https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/
// and https://codepen.io/andrewscofield/pen/oGyrEv
var Visualizer = (() => {

	const svg = document.querySelector('#wave');
	const clipPath = svg.querySelector('clipPath');
	const gradientStops = [...document.querySelectorAll('#progress-gradient stop')];

	const config = {
		SAMPLE_COUNT: 261,
		WIDTH: 1,
		MAX_HEIGHT: 70,
		GAP: 2,
	}

	async function sample(buffer) {
		const context = new AudioContext();
		const audioBuffer = await context.decodeAudioData(buffer);
		const channelData = audioBuffer.getChannelData(0);

		const blockSize = Math.floor(channelData.length / config.SAMPLE_COUNT);
		const samples = [];
		for (let i = 0; i < config.SAMPLE_COUNT; i++) samples.push(channelData[i * blockSize]);

		context.close();

		return samples;
	}
	function normalize(samples) {
		samples = samples.map(s => Math.abs(s));
		const multiplier = Math.pow(Math.max(...samples), -1) * config.MAX_HEIGHT;
  		return samples.map(s => s * multiplier);
	}

	async function fromSrc(url) {
		const buffer = await fetch(url)
			.then((response) => response.arrayBuffer());

		return fromBuffer(buffer);
	}
	async function fromBuffer(buffer) {
		const samples = await sample(buffer);
		return normalize(samples);
	}

	function render(data) {
		clipPath.innerHTML = '';
		data.forEach((s, i) => {
			const x = i * config.GAP;
			const line = `<rect x="${x}" y="0" height="${s}" width="${config.WIDTH}" fill="#000"></rect>`;
			clipPath.insertAdjacentHTML('beforeend', line);
		});

		svg.classList.add('done');
	}
	function hide() {
		svg.classList.remove('done');
	}
	function setProgress(progress) {
		gradientStops.forEach(s => s.setAttribute('offset', progress * 100 + '%'));
	}

	return {
		fromSrc,
		fromBuffer,

		render,
		hide,
		setProgress
	}

})();
