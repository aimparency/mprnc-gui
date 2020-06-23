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
				v-text="getText('effort_str')"
				contenteditable="true" 
				class="effort"
				v-on:focus="edit('effort_str')"
				v-on:blur="endEdit($event, 'effort_str')"/>
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
	effort_str: "estimate the effort"
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
			} else if (this.data[field]) {
				return this.data[field]
			} else {
				return placeholders[field] 
			}
		},
		edit: function(field) {
			if(this.changes[field] === undefined) {
				this.$set(this.changes, field, "")
			}
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
			let ok = this.translateChanges()
			if(ok) {
				this.hint = this.save_changes(this.changes)
			}
		},
		translateChanges: function() {
			let changes = Object.assign({}, this.changes)
			translateEffortIfSet(changes) 
		}
		translateEffortIfSet: function(changes) {
			let effort_str = changes.effort
			if(this.changes.effort == undefined) {
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
					if(allowed_units.includes(effort_str.slice(-unit.length))) {
						matched_unit = unit
						break
					}
				}
				if(matched_unit === undefined) {
					err("effort unit must be one of " + allowed_units.join(' | '))
				}
				if(isNaN(Number(effort_str.slice(0,-3)))) {
					err("effort must be a number followed by a unit")
				}
			}
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

const corrections = {
	"minute": "min",
	"hour": "h",
	"day": "d",
	"week": "w",
	"month": "m",
	"year": "y"
}

const type = {
	"min": "Minutes", 
	"h": "Hours", 
	"d": "Days", 
	"w": "Weeks", 
	"m": "Months", 
	"y": "Years", 
}

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
