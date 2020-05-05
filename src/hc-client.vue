<template>
	<div>
		<div v-if="callZome === undefined" style="color:#bb492f">
			not connected to the conductor
		</div>
		<div v-else>
			<button v-on:click="refresh_all">refresh all</button>
		</div>
	</div>
</template>

<script>
import { connect } from '@holochain/hc-web-client'

export default {
	data: function() {
		return {
			agent_address: undefined, 
			callZome: undefined, 
			new_friendship_request_target_agent_address: undefined, 
			new_followship_target_agent_address: undefined, 
			incoming_friendship_requests: [],
			outgoing_friendship_requests: [], 
			followers: [], 
			following: [], 
			recently_creates_test_entry_address: "", 

			new_test_entry_message: "", 
			test_entries: [],
			test_entry_addresses: [],
			retrieved_test_entry_message: "", 
			test_entry_address: "",
		}
	},
	props: [
		'conductor_url',
		'conductor_instance'
	],
	methods: {
		refresh_all: function(event) {
		},
	},
	created: function() {
		this.hc_connection = connect({url: this.conductor_url})
		this.hc_connection.then(({callZome, close}) => {
			//// example zome call: 
			// callZome(
			// 	this.conductor_instance, 
			// 	'social_graph', 
			// 	'my_agent_address'
			// )({}).then(result => {
			// 	try {
			// 		var result = JSON.parse(result) 
			// 		this.agent_address = result.Ok
			// 		this.callZome = callZome
			// 		this.refresh_all()
			// 	} catch {
			// 		console.error("bad response")
			// 	}
			// })
		})
	},
	components: {		
	}
}
</script>

<style>
div {
	color: #fff;
	margin: 10px;
	padding: 5px;
	background-color: rgba(90, 130, 200, 0.2);
	border-radius: 5px;
	border: 2px solid rgba(45, 65, 100, 0.5);
}
input, button {
	padding: 0.3em; 
	margin: 0.5em; 
	border-radius: 0.3em;
	background-color:#fff2;
	color:#fff; 
}
input {
	border: none; 
}
::placeholder {
	color: #aaa; 
}
button {
	border: 0.15em solid white;
	cursor: pointer;
}
button:hover{
	background-color:#fff6; 
}
</style>
