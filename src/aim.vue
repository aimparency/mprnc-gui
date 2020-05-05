<template>
	<div>
		<h5>{{data.title}}</h5>
		<p>{{data.description}}</p>
		<p>{{data.date}}, <a>{{data.creator.slice(0,10) + "..."}}</a></p>
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
</style>
