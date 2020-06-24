<template>
	<div 
		class="aim"
		v-bind:style="{backgroundColor: data.color}">
		<div class="left-side">
			<div><p 	
				v-text="getText('title')"
				contenteditable="true" 
				class="title" 
				v-on:focus="edit('title')" 
				v-on:blur="endEdit($event, 'title')"/>
			</div>
			<div><p 
				v-text="getText('description')"
				contenteditable="true" 
				class="description"
				v-on:focus="edit('description')"
				v-on:blur="endEdit($event, 'description')"/>
			</div>
		</div><div class="right-side">
			<div><p 
				v-text="getText('effort')"
				contenteditable="true" 
				class="effort"
				v-on:focus="edit('effort')"
				v-on:blur="endEdit($event, 'effort')"/>
			</div>
			<p class="timestamp">{{ timestampToDate(data.timestamp_ms) }}</p>
		</div>
		<div 
			v-if="changesExist()"
			v-bind:style="{backgroundColor: data.color}"
			class="edit-buttons">
			<p v-if="hint" class="error">{{ hint }}</p>
			<button 
				class="save"
				v-on:click="validateAndSaveChanges">save</button>
			<button 
				class="discard"
				v-on:click="discardChanges">discard</button>
		</div>
	</div>
</template>

<script>
import Aim from './aim.vue'
import Utils from './utils.js'

let placeholders = {
	title: "enter a title for the aim here", 
	description: "add a detailed description",
	effort: "estimate the effort"
}

const corrections = {
	"minute": "min",
	"hour": "h",
	"day": "d",
	"week": "w",
	"month": "m",
	"year": "y"
}

const unit_type = {
	"min": "Minutes", 
	"h": "Hours", 
	"d": "Days", 
	"w": "Weeks", 
	"m": "Months", 
	"y": "Years", 
}

const unit_type_rev = {}
for(let key in unit_type){
	unit_type_rev[unit_type[key]] = key
}

const display = {
	effort: value => {
		if(typeof value == "object") {
			let key = Object.keys(value)[0]
			if(key !== undefined) {
				return value[key] + unit_type_rev[key]
			} 
		}
	}
}

const parse = {
	
}

export default {
	data: function() {
		return {
			changes: {}, 
			hint: "",
		}
	},
	props: {
		data: Object,
		save_changes: Function
	},
	created: function() {
	},
	methods: {
		discardChanges: function() {
			this.changes = {}
			this.hint = ""
		},
		getText: function(field) {
			if(this.changes[field] !== undefined) {
				return this.changes[field]
			} else {
				let value = this.data[field]
				if(display[field]) {
					value = display[field](value)
				}
				if (value) {
					return value
				} else {
					return placeholders[field] 
				}
			}
		},
		edit: function(field) {
			if(this.changes[field] === undefined) {
				this.$set(this.changes, field, "")
			}
			// TODO: use existing text with display["field"]
		},
		endEdit: function(event, field) {
			this.$set(this.changes, field, event.target.innerText.trim() || undefined)
		},
		changesExist: function() {
			for(let key in this.changes) {
				if(this.changes[key] != this.data[key]) {
					return true
				}
			}
			return false
		},
		timestampToDate: function (timestamp){
			if(timestamp === undefined) return "just now" 
			let a = new Date(timestamp)
			let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
			let year = a.getFullYear()
			let month = months[a.getMonth()]
			let date = a.getDate()
			let hour = Utils.pad2(a.getHours())
			let min = Utils.pad2(a.getMinutes())
			let sec = Utils.pad2(a.getSeconds())
			let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec 
			return time;
		},
		validateAndSaveChanges: function() {
			let changes = {}
			for(let change in this.changes) {
				if(this.changes[change] != undefined) {
					changes[change] = this.changes[change]
				}
			}
			if(this.validateAndTranslateEffort(changes)) {
				this.hint = this.save_changes(changes)
			}
		},
		validateAndTranslateEffort: function(changes) {
			let effort_str = changes.effort
			let error = ""
			let err = (msg) => {
				error += ( error == "" ? "" : ", " ) + msg
			}	
			if(effort_str == undefined) {
				err("you must set an effort for this aim")
			} else {
				for(let correction in corrections){
					if(effort_str.slice(-correction.length) == correction) {
						effort_str = corrections[correction]
					}
				}
				let allowed_units = ['min', 'h', 'd', 'w', 'm', 'y']
				let matched_unit = undefined
				for(let unit of allowed_units){
					if(unit == effort_str.slice(-unit.length)) {
						matched_unit = unit
						let value = Number(effort_str.slice(0, -unit.length))
						if(isNaN(value)) {
							err(`recognized unit "${unit}", but "${value}" is not a number`)
						} else {
							changes.effort = {
								[unit_type[unit]]: value
							}
						}
						break
					}
				}
				if(matched_unit === undefined) {
					err("effort unit must be one of " + allowed_units.join(' | '))
				}
			}
			if(error){
				this.hint = error
				return false
			} else {
				return true
			}
		},
	},
	components: {
	}
}

/* TODO:
	beim saven umwandeln in diese struktur: 
	effort: Day: 1

	in get Text diese struktur umwandeln zu Text
		- methode map einführen

	bei edit den Text replacen mit dem was map zurückgibt
		
	-

	anderes thema: colos: auch mitschicken

	hApp neu packagen

	beten
*/

</script>

<style lang="scss">
.aim {
	position:relative; 
	border-radius: 0.2em; 
	box-shadow: 0em 0em 0.5em #000; 
	padding: 1em; 
	margin: 1em 0em; 
}
.aim .left-side, .aim .right-side {
	display: inline-block; 
	margin: 0px; 
	vertical-align: top; 
}
.aim .left-side {
	width: 86%; 
}
.aim .right-side {
	width: calc(14%); 
	text-align: right
}

.aim .title, .aim .description, .aim .effort {
	width: calc(100% - 0.8em); 
	margin: 0.1em;
	display: inline-block; 
}

.aim .title {
	font-weight: bold; 
}
.aim .timestamp {
	font-size: 0.7em; 
}


.edit-buttons {
	position: absolute; 
	right: 0em; 
	top: calc(100% - 0.2em - 0.2em); /*compansate both border radiuses */ 
	border-radius: 0.2em; 
	padding: 0.4em; 
	box-shadow: 0em 0.5em 0.5em -0.5em #000;
	text-align: right; 
	z-index: 10; 
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
