<template>
	<div 
		class="aim-list-entry" 
		v-on:click="view_details"
		v-bind:style="{backgroundColor: aimColor}">
		<div class="left-side">
			<div><p 	
				v-text="data.title"
				class="title"/>
			</div>
			<div><p 
				v-text="data.description"
				class="description"/>
			</div>
		</div><div class="right-side">
			<div>
				<p 
					v-text="effort_str"
					class="effort"/>
				<p class="timestamp">{{ effort_str }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import Utils from './utils.js'
import Effort from './types/effort.js'

export default {
	data: function() {
		return {
		}
	},
	props: {
		data: Object,
		view_details: Function
	},
	created: function() {
	},
	computed: {
		aimColor: function() {
			return "#" + this.data.color.join("")
		},
		effort_str: function() {
			return Effort.to_str(this.data.effort)
		}, 
		timestamp_str: function() {
			return Utils.formatDate(this.data.timestamp_ms)
		},
	},
	methods: {
	},
	components: {
	}
}

</script>

<style lang="scss">
.aim-list-entry {
	position:relative; 
	border-radius: 0.2em; 
	box-shadow: 0em 0em 0.5em #000; 
	padding: 1em; 
	cursor: pointer; 
	&:hover{
		border: 0.2rem solid white; 
		padding:0.8rem;
	}
}

.aim-list-entry + .aim-list-entry {
	margin-top: 1rem; 
}

.aim-list-entry .left-side, .aim-list-entry .right-side {
	display: inline-block; 
	margin: 0px; 
	vertical-align: top; 
}
.aim-list-entry .left-side {
	width: 86%; 
}
.aim-list-entry .right-side {
	width: calc(14%); 
	text-align: right
}

.aim-list-entry .title, .aim-list-entry .description, .aim-list-entry .effort {
	width: calc(100% - 0.8em); 
	margin: 0.1em;
	display: inline-block; 
}

.aim-list-entry .title {
	font-weight: bold; 
}
.aim-list-entry .timestamp {
	margin:0.2rem;
	font-size: 0.7em; 
}

</style>
