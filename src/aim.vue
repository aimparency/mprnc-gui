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
			<p class="timestamp">{{ timestampToDate(data.timestamp_ms) }}</p>
			<div><p 
				v-text="getText('effort')"
				contenteditable="true" 
				class="effort"
				v-on:focus="edit('effort')"
				v-on:blur="endEdit($event, 'effort')"/>
			</div>
		</div>
		<div 
			v-if="changesExist()"
			v-bind:style="{backgroundColor: data.color}"
			class="edit-buttons">
			<button class="save">save</button>
			<button class="discard">discard</button>
		</div>
		<button v-on:click="test">test</button>
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

export default {
	data: function() {
		return {
			changes: {
				title: undefined, 
				description: undefined, 
				effort: undefined
			}
		}
	},
	props: {
		data: Object,
		save_changes: Function
	},
	created: function() {
		console.log(this.data.color)
		console.log(Utils)
	},
	methods: {
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
			console.log(this.changes[field]) 
		},
		changesExist: function() {
			for(let key in this.changes) {
				if(this.changes[key] != this.data[key]) {
					console.log(key)
					return true
				}
			}
			return false
		},
		test: function() {
			this.data.title = "hallo"
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
			if(this.validateChanges()){
				this.save_changes(this.changes)
			}
		},
		/**
		 * Checks that all information for a new aim creation given is ok.
		 * Side Effect: hint for user in case of failed checks
		 * 
		 * @returns {boolean} true if all checks passed
		 */
		validateChanges: function() { 
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
				let matched_unit = undefined
				for(let unit of allowed_units){
					if(allowed_units.includes(this.new_aim.effort_str.slice(-unit.length))) {
						matched_unit = unit
						break
					}
				}
				if(matched_unit === undefined) {
					err("effort unit must be one of " + allowed_units.join(' | '))
				}
				if(isNaN(Number(this.new_aim.effort_str.slice(0,-3)))) {
					err("effort must be a number followed by a unit")
				}
			}
			if(failure) {
				this.invalid_changes = error
			} else {
				this.invalid_changes = ""
			}
			return !failure
		},
	},
	components: {
	}
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
.aim a {
	color: #3388f2;
}
.aim p {
	margin: 0.1em;
	display: inline-block; 
	width: calc(100% - 0.2em); 
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
}

.edit-buttons button {
	margin:0.2em
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
</style>
