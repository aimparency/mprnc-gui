<template>
	<div v-if="conductor_key === undefined">
		<h3> set conductor in order to proceed </h3> 
		HC conductor protocol: <input type="text" v-model="hc_conductor_protocol" /> <br/> 
		HC conductor host: <input type="text" v-model="hc_conductor_host" /> <br/> 
		HC conductor port: <input type="text" v-model="hc_conductor_port" /> <br/>
		HC conductor instance: <input type="text" v-model="conductor_instance" /> <br/>
		<button v-on:click="setConductor">set conductor</button>
	</div>
	<div v-else>
		<p> 
			using conductor {{ conductor_url }}, instance {{conductor_instance}}
			<button v-on:click="unsetConductor">switch</button>
		</p>
		<Mprnc
			v-bind:conductor_url="conductor_url"
			v-bind:conductor_instance="conductor_instance"/>
	</div>
</template>

<script>
import Mprnc from './mprnc.vue'

export default {
	data: function() {
		return {
			hc_conductor_protocol: 'ws',
			hc_conductor_host: 'localhost',
			hc_conductor_port: 8888,
			conductor_instance: 'test-instance',
			conductor_url: undefined,
			conductor_key: undefined, 
		}
	},
	mounted: function() {
		this.setConductor()
	},
	methods: {
		setConductor: function(event) {
			this.conductor_url = 
				this.hc_conductor_protocol + '://' + 
				this.hc_conductor_host + ':' +
				this.hc_conductor_port
			this.conductor_key = this.conductor_url + "\\" + this.conductor_instance
		}, 
		unsetConductor: function(event) {
			this.conductor_key = undefined
		}
	},
	components: {		
		Mprnc
	}
}
</script>

<style>
body {
	color: #eee;   
	font-family: Sans-Serif;
}
textarea {
	font-family: Sans-Serif;
}
div {
	outline: 1px solid #f0f5; 
}
</style>
