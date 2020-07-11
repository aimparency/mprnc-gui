<template>
	<div :class="{navigator: true, right: !view_left_side}">
		<div 
			v-for="page, i in pages" 
			:key="i"
			>
			<AimDetails 
				v-if="page.mode == 'details'"
				/>
		</div>

		<div class="v-split contributing-aims">
			<div class="aimlist"><!-- TODO: put this in a component? -->
				<Aim 
					v-for="aim in aims" 
					:key="aim.address" 
					v-bind:save_changes="updateAim"
					v-bind:data="aim"/>
				<Aim 
					:key="new_aim_counter"
					v-bind:is_create_template="true"
					v-bind:save_changes="createAim"
					v-bind:data="new_aim"/>
			</div>
			<div class="input-sliders">
			</div>
		</div>
		<div class="v-split detailed-aim">
			<div class="root">
				<b>Root aims</b><br/>
				well, when no aim is selected, all root aims are displayed on the left.<br/>
				There is also some info about what you can see here <br/>
				It's the root view of the navigator. 
			</div>
		</div>
		<div class="v-split benefited-aims"> 
			<div class="aimlist">
				<Aim 
					v-for="aim in aims" 
					:key="aim.address" 
					v-bind:save_changes="updateAim"
					v-bind:data="aim"/>
				<Aim 
					:key="new_aim_counter"
					v-bind:is_create_template="true"
					v-bind:save_changes="createAim"
					v-bind:data="new_aim"/>
			</div>
		</div>
		<div
			v-on:click="shift"
			:class="{shift_overlay: true, right: !view_left_side}">
			this gets positioned over the partially hidden pag
		</div>
	</div>
</template>

<script>
import Aim from './aim.vue'
import Utils from './utils.js'


export default {
	data: function() {
		return {
			new_aim: this.gen_new_aim(),
			new_aim_counter: 0,
			pages: [],
			aims: [],
			history: [], // { address: ..., direction: 'contributing' | 'profitting' }  
			history_pointer: -1, // points to the previous history entry
			current_aim: undefined,
			view_left_side: true,
		}
	},
	props: {
		hc_call_zome: Function,
		current_profile: Object,
	},
	created: function() {
		this.refresh_aims()
		this.hc_call_zome('profiles', 'get_root_aim', {profile: this.current_profile.address}).then(result => {
			this.page[0] = {
				mode: 'empty' 
			}
			this.page[1] = {
				mode: 'list',
				connectedTo: result.Ok, 
				connectionDirection: 'receiving'
			}
			this.page[2] = {
				mode: 'details', 
				aimAddress: result.Ok, 
			}
			this.page[3] = {
				mode: 'list',
				connectedTo: result.Ok,
				connectedDirection: 'contributing'
			}
			console.log("root aim has address", result.Ok)
		})
	},
	methods: {
		shift: function() {
			this.view_left_side = !this.view_left_side
		},
		gen_new_aim: function() {
			return {
				color: Utils.randomHexColor(0.4).split(""),
				description: ""
			}
		},
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
		createAim: function(changes) {
			let aim = Object.assign({}, this.new_aim, changes, {
				timestamp_ms: Date.now()
			})
			console.log("creating a new aim with data: ", aim) 
			let errors = this.validateAimAttributes(aim)
			if(errors) {
				return errors
			} else {
				this.hc_call_zome(
					'aims', 
					'create_aim', 
				)({
					...aim,
					profile: this.current_profile.address
				}).then(result => {
					console.log(result) 
					setTimeout(() => {
						this.refresh_aims()
						this.new_aim = this.gen_new_aim()
						this.new_aim_counter += 1
					}, 100)
				})
			}
		},
		updateAim: function(changes) {
			
		},
		/**
		 * Checks that all attributes of a given aim have valid values
		 * Side Effect: hint for user in case of failed checks
		 * 
		 * @returns {String} error explanation, "" if all checks passed
		 */
		validateAimAttributes: function(aim) { 
			let error = ""
			let err = (msg) => {
				error += ( error == "" ? "" : ", " ) + msg
			}	
			if(aim.title == undefined || aim.title == "") {
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
			if(aim.effort == undefined) {
				err("you must set an effort for this aim")
			} 
			if(error != "") {
				return error
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

<style lang="scss">
$page-width: 31%; 
$distance: 1%;

@keyframes unshift {
	from {
		left: -46vw;
	}
	to {
		left: 0vw; 
	}
}
@keyframes shift {
	from {
		left: 0vw;
	}
	to {
		left: -46vw; 
	}
}

.navigator {
	position:absolute;
	left: 0vw; 
	top: 10vh; 
	width: 150vw; 
	height: 80vh; 
	animation-name: shift; 
	animation-duration: 0.25s;
	animation-timing-function: ease-in-out; 
	animation-direction: reverse; 
}

.navigator.right {
	animation-name: unshift;
	left: -46vw;
}

.shift_overlay, 
.v-split {
	position:absolute; 
	height: 100%; 
	width: $page-width; 
	top: 0%; 
	background-color: #7772;
	border-radius: 0.5vw; 
}

.shift_overlay.right, 
.contributing-aims {
	left: $distance; 
}

.detailed-aim {
	left: calc(#{$page-width} + 2 * #{$distance});
}

.detailed-aim .root {
	position: absolute; 
	top: 50%; 
	width: 100%; 
	text-align: center; 
	transform: translate(0, -50%);
}

.shift_overlay,
.benefited-aims {
	left: calc(2 * #{$page-width} + 3 * #{$distance});
}

.shift_overlay {
	background-color: #fff4; 
}

input, button, select, textarea, [contenteditable="true"] {
	padding: 0.3em; 
	margin: 0.5em; 
	border-radius: 0.3em;
	border: none;
	background-color:#fff2;
	color:#fff; 
	font-size: 1em;
}

button {
	border: 0.1em solid #fff3; 
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
