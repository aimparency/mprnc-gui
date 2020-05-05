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
						v-bind:value="profile.creator">
						{{ profile.name }}
					</option>
				</select>
			</p>
			<div>
				<Aim v-for="aim in aims" :key="aim.address" v-bind:data="aim"/>
				<div>
					<h4>Create aim: </h4>
					<p v-for="(value, name) in new_aim"> 
						{{ name }}:
						<input type="text" v-model="new_aim[name]" v-bind:placeholder="name"/>
					</p>
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
