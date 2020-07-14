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
		return "" +
			this.pad2(parseInt(r * f * 256).toString(16)) +
			this.pad2(parseInt(g * f * 256).toString(16)) +
			this.pad2(parseInt(b * f * 256).toString(16))
	},
	formatDate: function(in_ms) {
		let a = new Date(in_ms)
		let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
		let year = a.getFullYear()
		let month = months[a.getMonth()]
		let date = a.getDate()
		let hour = this.pad2(a.getHours())
		let min = this.pad2(a.getMinutes())
		let sec = this.pad2(a.getSeconds())
		let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec 
		return time;
	}
}
