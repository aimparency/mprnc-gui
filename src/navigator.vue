<template>
	<div class="navigator">
		<div class="v-split current-aim">
			<div class="back to_contributing_aim">
				&lt;
			</div><div class="aim-details">
				Root aims
			</div><div class="back to_benefiting_aim">
				&gt;
			</div>
		</div>

		<div class="v-split connected-aims"> 
			<div class="direction-switch show-contributing">
				c
			</div><div class="aimlist">
				<Aim 
					v-for="aim in aims" 
					:key="aim.address" 
					v-bind:save_changes="updateAim"
					v-bind:data="aim"/>
				<Aim 
					v-bind:is_create_template="true"
					v-bind:save_changes="createAim"
					v-bind:data="new_aim"/>
			</div><div class="direction-switch show-benefited">
				b
			</div>
		</div>
	</div>
</template>

<script>
import Aim from './aim.vue'
import Utils from './utils.js'

export default {
	data: function() {
		return {
			new_aim: {
				timestamp_ms: undefined,
				color: Utils.randomHexColor(0.4),
				title: undefined,
				description: undefined,
				effort: undefined,
			},
			new_aim_mistakes: "",
			aims: [],
			history: [], // { address: ..., direction: 'contributing' | 'profitting' }  
			history_pointer: -1, // points to the previous history entry
			current_aim: undefined,
		}
	},
	props: {
		hc_call_zome: Function,
		current_profile: Object,
	},
	created: function() {
		this.refresh_aims()
	},
	methods: {
		refresh_aims: function() {
			if(this.current_profile !== undefined) {
				this.hc_call_zome(
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
		createAim: function() {
			if(this.checkNewAimData()){
				this.hc_call_zome(
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
		formatEffort: function() {
		}
	},
	components: {
		Aim
	}
}
</script>

<style>

#navigator {
	padding: 1em; 
	height: 60%;
	border-radius: 0.2em; 
	box-shadow: 0em 0em 0.5em #000; 
	padding: 1em 0em 1em 1em; 
	margin: 2em 1em; 
}


.v-split {
	width: 2em; 
	height: 100%; 
}

.current-aim,
.connected-aims {
	width: 100%; 
}

.connected-aims .aimlist,
.current-aim .aim-details { 
	display: inline-block; 
	margin: 0px; 
	border: none; 
	vertical-align: top; 
	width: calc(100% - 2em - 2em); 
	padding: 0em 1em;
}

.connected-aims .direction-switch,
.current-aim .back {
	display: inline-block; 
	background-color: #fff6;
	border-radius: 0.1em; 
	cursor: pointer;
	height: 2em; 
	width: 2em; 
}

.connected-aims .direction-switch:hover,
.current-aim .back:hover {
	background-color: #fff2;
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
