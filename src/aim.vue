<template>
	<div>
		<p class="aim-title">{{data.title}}</p>
		<p>{{data.description}}</p>
		<p>{{data.timestamp_ms}}</p>
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
	},
	created: function() {
	},
	components: {
	}
}
</script>

<style>
	a {
		color: #3388f2;
	}
	.aim-title {
		font-size: 1.5em; 
		font-weight: bold; 
	}
</style>
