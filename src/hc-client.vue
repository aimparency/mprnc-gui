<template>
	<div>
		<div v-if="callZome === undefined" style="color:#bb492f">
			not connected to the conductor
		</div>
		<div v-else>
			<button v-on:click="refresh_all">refresh all</button>
			<p> Your agent address: {{ agent_address }} </p>
			<p> Create profile: 
				<input 
					type="text" 
					v-model="new_profile.name"
					placeholder="new profile name"
					/>
				<button v-on:click="createNewProfile()">create new profile</button>
			</p>
			<p> Selected profile: 
				<select v-model="current_profile">
					<option value=""> select a profile </option>
					<option 
						v-for="profile in available_profiles" 
						:key="profile.creator"
						v-bind:value="profile">
						{{ profile.entry.name }}
					</option>
				</select>
			</p>
			<div v-if="current_profile !== undefined">
				<p> current profile: {{ current_profile.entry.name }} </p>
				<Aim v-for="aim in aims" :key="aim.address" v-bind:data="aim"/>
				<div>
					<h4>Create aim: </h4>
						<input type="text" v-model="new_aim.name" placeholder="name"/>
						<textarea v-model="new_aim.description" placeholder="description"/>
					</p>
					<button v-on:click="createAim()">create new aim</button>
				</div>
			</div>
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
			new_profile: {
				name: "",
			},
			new_aim: {
				title: undefined, 
				description: undefined,
			},
			current_profile: undefined, 
			available_profiles: [],
			aims: [],
		}
	},
	props: [
		'conductor_url',
		'conductor_instance'
	],
	methods: {
		refresh_all: function(event) {
			this.refresh_available_profiles()
			this.refresh_aims()
		}, 
		refresh_available_profiles: function() {
			this.callZome(
				this.conductor_instance, 
				'profiles', 
				'get_my_profiles'
			)({}).then(result => {
				result = JSON.parse(result)
				console.log("profiles result, deal with it^^", result)
				this.available_profiles = result.Ok
			})
		},
		refresh_aims: function() {
			console.log("next step: implement refresh aims, also in happ") 
		}, 
		createNewProfile: function(event) {
			this.callZome(
				this.conductor_instance, 
				'profiles', 
				'create_profile'
			)(this.new_profile).then(result => {
				result = JSON.parse(result) 
				console.log("profile creation result:", result) 
			})
		}
	},
	created: function() {
		this.hc_connection = connect({url: this.conductor_url})
		this.hc_connection.then(({callZome, close}) => {
			this.callZome = callZome
			callZome(
				this.conductor_instance, 
				'profiles', 
				'get_my_agent_address'
			)({}).then(result => {
				result = JSON.parse(result) 
				this.agent_address = result.Ok
				this.refresh_all()
			})
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
p {
	margin: 0.2em;
}
input, button, select, textarea {
	padding: 0.3em; 
	margin: 0.5em; 
	border-radius: 0.3em;
	background-color:#fff2;
	color:#fff; 
}
textarea {
	width: calc(100% - 1.2em);
	border: none;
	margin: 0.5em;
	min-height:4em;
	resize: vertical; 
	background-color:#fff2;
}
option {
	background-color: rgb(45, 75, 100);
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
