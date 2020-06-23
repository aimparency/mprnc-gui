export default {
	pad2: function(n) {
		return ("0" + String(n)).substr(-2)
	},
	randomHexColor: function(lightness) {
		let r = Math.random()
		let g = Math.random()
		let b = Math.random()
		let length = Math.sqrt(r * r + g * g)
		length = Math.sqrt(length * length + b * b)
		let f = lightness / length
		return '#' +
			this.pad2(parseInt(r * f * 256).toString(16)) +
			this.pad2(parseInt(g * f * 256).toString(16)) +
			this.pad2(parseInt(b * f * 256).toString(16))
	}
}
