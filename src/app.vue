<template>
	<div id="hc_settings" v-if="hc_call_zome === undefined">
		<p class="error">
			not connected to the conductor
		</p>
		<h3> set conductor in order to proceed </h3> 
		HC conductor protocol: <input type="text" v-model="hc_conductor_protocol" /> <br/> 
		HC conductor host: <input type="text" v-model="hc_conductor_host" /> <br/> 
		HC conductor port: <input type="text" v-model="hc_conductor_port" /> <br/>
		HC conductor instance: <input type="text" v-model="hc_conductor_instance" /> <br/>
		<button v-on:click="setConductor">set conductor</button>
	</div>
	<div
		class="content"
		v-else>
		<p> 
			<button v-on:click="unsetConductor">switch conductor</button>
			{{ hc_agent_address }}
		</p>
		<ListNavigator
			v-bind:hc_call_zome="hc_call_zome"
			/>
	</div>
</template>

<script>
import { connect } from '@holochain/hc-web-client'
import ListNavigator from './list-navigator.vue'

export default {
	data: function() {
		return {
			hc_conductor_protocol: 'ws',
			hc_conductor_host: 'localhost',
			hc_conductor_port: 8888,
			hc_conductor_instance: 'test-instance',
			hc_conductor_url: undefined,
			hc_agent_address: undefined,
			hc_call_zome: undefined,
			print_sth: undefined
		}
	},
	created: function() {
		this.setConductor()
	},
	methods: {
		setConductor: function(event) {
			this.hc_conductor_url = 
				this.hc_conductor_protocol + '://' + 
				this.hc_conductor_host + ':' +
				this.hc_conductor_port
			this.connectConductor()
		},
		unsetConductor: function(event) {
			this.disconnectConductor()
		},
		connectConductor: function() {
			this.hc_connection = connect({url: this.hc_conductor_url})
			this.hc_connection.then(({callZome, close}) => {
				this.hc_connection_close = close
				this.hc_call_zome = (zome, fn) => {
					return callZome(this.hc_conductor_instance, zome, fn) 
				}
				let scope = 1
				this.print_sth = (zome, fn) => {
					return zome + fn + "name" + scope
				}
				this.getAgentAddress()
			})
		},
		getAgentAddress: function() {
			this.hc_call_zome(
				'aims', 
				'get_agent_address', 
			)({}).then(result => {
				result = JSON.parse(result) 
				this.hc_agent_address = result.Ok
			})
			this.hc_call_zome(
				'aims', 
				'get_aims', 
			)({}).then(result => {
				result = JSON.parse(result) 
			})
		},
		disconnectConductor: function() {
			this.hc_call_zome = undefined
			this.hc_agent_address = undefined
			this.hc_connection_close()
		},
	},
	components: {		
		ListNavigator
	}
}
</script>

<style lang="scss">
div {
	margin: 0; 
	padding: 0; 
	border: none; 
	/* outline: 1px solid #f0f5; */
}
#hc_settings {
	background-color: #fff1;
	border-radius: 1em; 
	margin:1em; 
	padding:1em; 
}

.content {
	overflow:hidden; 
}

.content p {
	margin: 0.2rem 1rem;
}

p .error {
	color: $error-color;
}

body {
	overflow: hidden;
	color: #eee;   
	font-family: Sans-Serif;
	font-size: 1em; 
	background-color: #1b2233;
	height: 100%; 
	margin: 0px;
}
textarea {
	font-family: Sans-Serif;
}
</style>
