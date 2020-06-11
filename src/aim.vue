<template>
	<div class="aim">
		<div class="left-side">
			<p class="title">{{data.title}}</p>
			<p class="description">{{data.description}}</p>
		</div>
		<div class="right-side">
			<p class="timestamp">{{ timestampToDate(data.timestamp_ms) }}</p>
		</div>
	</div>
</template>

<script>
import Aim from './aim.vue'

export default {
	data: function() {
		return {
		}
	},
	props: [
		'data',
	],
	methods: {
		timestampToDate: function (timestamp){
			let a = new Date(timestamp)
			let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
			let year = a.getFullYear()
			let month = months[a.getMonth()]
			let date = a.getDate()
			let hour = pad(a.getHours())
			let min =  pad(a.getMinutes())
			let sec = pad(a.getSeconds())
			let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec 
			return time;
		},
	},
	created: function() {
	},
	components: {
	}
}

let pad = (n) => ("0" + String(n)).substr(-2) 
</script>

<style>
	.aim {
		border-radius: 0.2em; 
		box-shadow: 0em 0em 0.5em #000; 
		padding: 1em; 
		margin: 2em 1em; 
	}
	.aim .left-side, .aim .right-side {
		display: inline-block; 
		margin: 0px; 
		vertical-align: top; 
	}
	.aim .left-side {
		width: 86%; 
	}
	.aim .right-side {
		width: 13%; 
		text-align: right
	}
	.aim a {
		color: #3388f2;
	}
	.aim .title {
		font-weight: bold; 
	}
	.aim .timestamp {
		font-size: 0.7em; 
	}
</style>
