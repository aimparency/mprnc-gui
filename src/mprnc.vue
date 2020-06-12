<template>
	<p v-if="callZome === undefined" class="error">
		not connected to the conductor
	</p>
	<div v-else id="#mprnc">
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
			<select v-model="current_profile" v-on:change="refresh_aims()">
				<option v-bind:value="undefined"> select a profile </option>
				<option 
					v-for="profile in available_profiles" 
					:key="profile.address"
					v-bind:value="profile">
					{{ profile.entry.name }}
				</option>
			</select>
		</p>
		<div v-if="current_profile !== undefined" >
			<div class="current-aim">
				<div class="navbar">
					<div class="back"></div>
					<div class="contributions"></div>
				</div><div class="aimlist"> 
					Root aims
					<Aim v-for="aim in aims" :key="aim.address" v-bind:data="aim"/>
				</div>
			</div>
			<div>
				<p>Create aim: </p>
				<input type="text" v-model="new_aim.title" placeholder="title"/>
				effort: <input type="text" v-model="new_aim.effort_str" placeholder="1d"/>
				<textarea v-model="new_aim.description" placeholder="description"/>
				<p class="error">{{ new_aim_mistakes }}</p>
				<button v-on:click="createAim()">create new aim</button>
			</div>
		</div>
	</div>
</template>

<script>
import { connect } from '@holochain/hc-web-client'
import Aim from './aim.vue'

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
				effort: undefined,
			},
			new_aim_mistakes: "",
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
				if(this.current_profile == undefined && this.available_profiles !== undefined) {
					this.current_profile = this.available_profiles[0]
				}
				this.refresh_aims()
			})
		},
		refresh_aims: function() {
			if(this.current_profile !== undefined) {
				this.callZome(
					this.conductor_instance, 
					'aims', 
					'get_aims'
				)({profile: this.current_profile.address}).then(result => {
					console.log(result) 
					result = JSON.parse(result)
					this.aims = result.Ok
					console.log("aim list: ", this.aims) 
				})
			}
		}, 
		createNewProfile: function(event) {
			this.callZome(
				this.conductor_instance, 
				'profiles', 
				'create_profile'
			)(this.new_profile).then(result => {
				result = JSON.parse(result) 
				this.refresh_available_profiles()
			})
		}, 
		createAim: function() {
			if(this.checkNewAimData()){
				this.callZome(
					this.conductor_instance, 
					'aims', 
					'create_aim', 
				)({
					...this.new_aim,
					profile: this.current_profile.address, 
					timestamp_ms: Date.now(),
				}).then(result => {
					console.log(result) 
					setTimeout(this.refresh_aims.bind(this), 100)
				})
			}
		},
		/**
		 * Checks that all information for a new aim creation given is ok.
		 * Side Effect: hint for user in case of failed checks
		 * 
		 * @returns {boolean} true if all checks passed
		 */
		checkNewAimData: function() { 
			let error = ""
			let failure = false
			let err = (msg) => {
				error += ( error == "" ? "" : ", " ) + msg
				failure = true
			}	
			if(this.new_aim.title == undefined || this.new_aim.title == "") {
				err("title mustn't be empty")
			}
			let corrections = {
				"minute": "min",
				"hour": "h",
				"day": "d",
				"week": "w",
				"month": "m",
				"mon": "m",
				"year": "y"
			}
			if(this.new_aim.effort_str == undefined) {
				err("you must set an effort for this aim")
			} else {
				for(let correction in corrections){
					if(this.new_aim.effort_str.slice(-correction.length) == correction) {
						this.new_aim.effort_str = corrections[correction]
					}
				}
				let allowed_units = ['min', 'h', 'd', 'w', 'm', 'y']
				let at_least_one_unit_matched = false
				for(let unit of allowed_units){
					if(allowed_units.includes(this.new_aim.effort_str.slice(-unit.length))) {
						at_least_one_unit_matched = true
						break
					}
				}
				if(!at_least_one_unit_matched) {
					err("effort unit must be one of " + allowed_units.join(' | '))
				}
			}
			if(this.new_aim.description == undefined) {
				this.new_aim.description = ""
			}
			if(failure) {
				this.new_aim_mistakes = error
			} else {
				this.new_aim_mistakes = ""
			}
			return !failure
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
				this.refresh_available_profiles()
			})
		})
	},
	components: {
		Aim
	}
}
</script>

<style>
div.sub {
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

p.error {
	color: #ff7766;
}

.current-aim {
	padding: 1em; 
	height: 60%;
	border-radius: 0.2em; 
	box-shadow: 0em 0em 0.5em #000; 
	padding: 1em 0em 1em 1em; 
	margin: 2em 1em; 
}

.navbar, .aimlist { 
	display: inline-block; 
	margin: 0px; 
	border: none; 
	vertical-align: top; 
}

.navbar {
	width: 2em; 
	height: 100%; 
}

.aimlist {
	width: calc(100% - 2em - 2em); 
	padding: 0em 1em;
}

.navbar .back, 
.navbar .contributions {
	background-color: #fff6;
	border-radius: 0.1em; 
	cursor: pointer;
}
.navbar .back {
	height: 2em; 
}
.navbar .back:hover,
.navbar .contributions:hover {
	background-color: #fff2;
}

.navbar .contributions {
	margin-top: 1em;
	height: 6em; 
}

input, button, select, textarea {
	padding: 0.3em; 
	margin: 0.5em; 
	border-radius: 0.3em;
	border: 0.1em solid #444; 
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
	background-color:#333; 
}
input {
	border: none; 
}
::placeholder {
	color: #aaa; 
}
button {
	cursor: pointer;
	background-color:#fff6; 
}
button:hover{
	background-color:#fff2; 
}
</style>
