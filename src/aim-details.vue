<template>
	<div 
		v-if="loading"
		:class="{loading: true}"
	>
	</div>
	<div 
		v-else
		:class="{aimDetail: true}"
		v-bind:style="{backgroundColor: aim_color}">
		<div class="left-side">
			<div><p 	
				v-text="changes.title || 'enter a title here'"
				contenteditable="true" 
				class="title" 
				v-on:focus="editText($event, 'title')" 
				@keydown.esc="abortTextEdit($event, 'title')"
				v-on:blur="endTextEdit($event, 'title')"/>
			</div>
		</div><div class="right-side">
			<div><p 
				v-text="effort_str"
				contenteditable="true" 
				class="effort"
				v-on:focus="editEffort()"
				@keydown.esc="abortEffortEdid($event)"
				v-on:blur="endEffortEdit($event)"/>
			</div>
			<p class="timestamp">{{ timestamp_str }}</p>
		</div>

		<div><p 
			v-text="changes.description || 'add a detailed description here'"
			contenteditable="true" 
			class="description"
			v-on:focus="editText($event, 'description')" 
			@keydown.esc="abortTextEdit($event, 'description')"
			v-on:blur="endTextEdit($event, 'description')"/>
		</div>


		<div 
			v-if="changes_exist"
			class="edit-buttons">
			<p v-for="o, key in hints" :key="key" class="error">{{key}}: {{o}}</p>
			<button 
				v-if="!errors_exist"
				class="save"
				v-on:click="validateAndSaveChanges">save</button>
			<button 
				class="discard"
				v-on:click="clearChanges">discard</button>
		</div>
	</div>
</template>

<script>
import Utils from './utils.js'
import Effort from './types/effort.js'

let placeholders = {
	title: "enter a title for the aim here", 
	description: "add a detailed description",
	effort: "x<unit>"
}


function gen_new_aim() {
	return {
		description: "",
		color: Utils.randomHexColor(0.4).split(""),
		title: "", 
		description: "", 
		effort: {Days: 7},
		timestamp_ms: Date.now(),
		tags: [],
	}
}

export default {
	data: function() {
		return {
			aim: {
			},
			changes: {
			}, 
			loading: true, 
			hints: {
			},
			effort_str_input: undefined, 
		}
	},
	props: {
		settings: Object,
		hc_call_zome: Function, 
		switch_page: Function
	},
	created: function() {
		if(this.settings.aim_address !== undefined) {
			this.hc_call_zome('aims', 'get_aim_details')({aim_address: this.settings.aim_address}).then(result => {
				result = JSON.parse(result) 
				console.log("get aim details result", result)
				this.aim = result.Ok.aim
				this.clearChanges()
				this.loading = false
			})
		} else {
			this.aim = gen_new_aim()
			this.clearChanges()
			this.loading = false
		}
	},
	computed: {
		aim_color: function() {
			if(this.aim.color != undefined) {
				return "#" + this.aim.color.join("")
			} else {
				return "rgba(0,0,0,0)"
			}
		},
		effort_str: function() {
			if(this.changes) {
				return this.effort_str_input || Effort.to_str(this.changes.effort)
			} else {
				return ""
			}
		}, 
		timestamp_str: function() {
			return Utils.formatDate(this.aim.timestamp_ms)
		},
		changes_exist: function() {
			return this.changes !== undefined && (
				this.aim.title != this.changes.title
				|| this.aim.description != this.changes.description
				|| !Effort.equal(this.aim.effort, this.changes.effort)
				|| !this.aim.color.reduce((acc, cur, idx) => acc && ( cur == this.changes.color[idx] ), true)
			)
		},
		errors_exist: function() {
			return Object.keys(this.hints).length > 0
		}
	},
	methods: {
		clearChanges: function() {
			this.changes = {}
			this.changes.title = this.aim.title
			this.changes.description = this.aim.description
			this.changes.effort = Object.assign({}, this.aim.effort)
			this.changes.color = Object.assign([], this.aim.color)
		},
		discardChanges: function() {
			if(this.settings.aim_address !== undefined) {
				this.clearChanges()
				this.hints = {}
			} else {
				this.switch_page({
					...this.previous
				})
			}
		},
		validateAndSaveChanges: function() {
			if(Object.keys(this.hints).length == 0) {
				Object.assign(this.aim, this.changes)
				this.clearChanges()

				if(this.settings.aim_address !== undefined) {
					this.updateAim()
				} else {
					this.createAim()
				}
			} 
		},
		updateAim: function() {
			this.hc_call_zome(
				'aims', 
				'update_aim', 
			)({
				aim_address: this.settings.aim_address, 
				...this.aim
			}).then(result => {
				result = JSON.parse(result) 
				console.log("update_aim response", result)
			})
		}, 
		createAim: function() {
			this.hc_call_zome(
				'aims', 
				`create_${this.settings.relation}_aim`, 
			)({
				...this.aim,
				connected_aim_address: this.settings.connected_to
			}).then(result => {
				result = JSON.parse(result) 
				console.log("aim created", result)
				this.loading = true
				this.switch_page({
					type: 'aim-list',
					settings: {
						connected_to: this.settings.connected_to,
						relation: this.settings.relation, 
						trace: [result.Ok],
					}
				})
			})
		},
		editText: function(event, field) {
			event.target.innerText = this.changes[field] 
		}, 
		abortTextEdit: function(event, field) {
			this.ignore_next_end_text_edit = true
			event.target.innerText = this.changes[field]
			event.target.blur()
		},
		endTextEdit: function(event, field) {
			if(!this.ignore_next_end_text_edit) {
				let v = event.target.innerText.trim()
				this.changes = {
					...this.changes, 
					[field]: v
				}
			} else {
				this.ignore_next_end_text_edit = false
			}
		},
		editEffort: function() {
			console.log("starting effort: ", this.effort_str_input, this.effort_str)
			event.target.innerText = this.effort_str_input || this.effort_str
		},
		abortEffortEdit: function(event) {
			this.ignore_next_effort_edit_end = true
			event.target.blur()
		},
		endEffortEdit: function(event) {
			let v = event.target.innerText
			let parsed = Effort.from_str(v)
			console.log(parsed)
			if('Ok' in parsed) {
				console.log("parsed works") 
				this.effort_str_input = undefined
				this.changes = {
					...this.changes, 
					effort: parsed.Ok
				}
				this.$delete(this.hints, "effort")
			} else {
				this.hints = {
					...this.hints, 
					effort: parsed.Err
				}
				this.effort_str_input = v
			}
		}, 
		changesExist: function() {
			for(let key in this.changes) {
				if(this.changes[key] != this.aim[key]) {
					return true
				}
			}
			return false
		}
	}
}

</script>

<style lang="scss">
.aimDetail {
	position:relative; 
	border-radius: 0.5rem; 
	box-shadow: 0rem 0rem 0.5rem #000; 
	padding: 1rem; 
	margin: 0rem 0rem; 
	height: calc( 100% - 2rem) ; 
}
.aimDetail .left-side, .aimDetail .right-side {
	display: inline-block; 
	margin: 0px; 
	vertical-align: top; 
}
.aimDetail .left-side {
	width: 86%; 
}
.aimDetail .right-side {
	width: calc(14%); 
	text-align: right
}

.aimDetail .title, 
.aimDetail .description, 
.aimDetail .effort {
	width: calc(100% - 0.8em); 
	margin: 0.1em;
	display: inline-block; 
}

.loading {
	width: 100%; 
	height: 100%;
	background-color: #fff6; 
	border-radius: 0.5rem; 
}

.aimDetail .title {
	font-weight: bold; 
	font-size: 2rem;
}
.aimDetail .timestamp {
	margin:0.2rem;
	font-size: 1rem; 
}


.edit-buttons {
	position: absolute; 
	width:100%;
	right: 0rem; 
	top: 100%;
	transform: translate(0%, -100%);
	padding: 0.5rem; 
	text-align: right; 
}

.edit-buttons button {
	margin:0.2em;
}

.edit-buttons .save {
	background-color: rgba($save-green, 0.5); 
	&:hover {
		background-color: rgba($save-green, 0.2); 
	}
}

.edit-buttons .discard {
	background-color: rgba($abort-orange, 0.5); 
	&:hover {
		background-color: rgba($abort-orange, 0.2); 
	}
}

.edit-buttons .error {
	color: $error-color; 
	margin: 0.2em; 
}
</style>
