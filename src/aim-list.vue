<template>
	<div class="aim-list">
		<div class="search"> 
			filter: 
			<input/>
		</div>
		<AimListEntry 
			v-for="aim, i in aims"
			:key="i"
			v-bind:data="aim.aim"
			v-bind:view_details="view_details_fn(aim.aim_address)"
			/>
		<div
			class="buttons">
			<div 
				class="button existing"
				v-on:click="add_existing_aim"
				>
				add existing aim
			</div>
			<div 
				class="button new"
				v-on:click="add_new_aim"
				>
				add new aim
			</div>
		</div>
	</div>
</template>

<script>
import Utils from './utils.js'
import AimListEntry from './aim-list-entry.vue'

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

export default {
	data: function() {
		return {
			aims: [], 
		}
	},
	props: {
		settings: Object,
		save_changes: Function, 
		hc_call_zome: Function, 
		switch_page: Function, 
		view_details: Function, 
	},
	created: function() {
		if(this.settings.connected_to !== undefined) {
			console.log(this.settings)
			this.hc_call_zome("aims", `get_${this.settings.relation}_aims`)({
				aim_address: this.settings.connected_to
			}).then(result => {
				result = JSON.parse(result) 
				this.aims = result.Ok
				console.log("get aims call result", this.settings.relation, result)
			})
		}
	},
	methods: {
		view_details_fn: function (aim_address) {
			console.log("creating view_details with aim_address", aim_address)
			return () => { this.view_details(aim_address) }
		},
		add_new_aim: function() {
			this.switch_page({
				type: 'aim-details',
				settings: {
					relation: this.settings.relation, 
					connected_to: this.settings.connected_to,
				},
			}) 
		},
		add_existing_aim: function() {
			
		},
	},
	components: {
		AimListEntry
	}
}

</script>

<style lang="scss">
.aim-list {
	position:relative; 
	border-radius: 0.5rem; 
	box-shadow: 0rem 0rem 0.5rem #000; 
	padding: 1rem; 
	height: calc(100% - 2rem);
}

.aim-list .search,
.aim-list .button {
	border-radius: 0.2rem;
	padding: 1rem; 
}

.aim-list .search {
	margin: 0rem 0rem 2rem 0rem; 
	background-color: #fff2; 
}

.aim-list .buttons {
	background-color: #fff2; 
	border-radius: 0.2rem; 
	margin-top: 2rem; 
	padding: 1rem; 
}

.aim-list .button {
	cursor: pointer; 
}

.aim-list .button + .button {
	margin-top: 1rem;
}

$buttons: ( existing: #a3f, new: #1f5 );
@each $b, $c in $buttons {
	.button.#{$b} {
		background-color: darken($c, 20%); 
		&:hover{
			background-color: darken($c, 30%);
		}
	}
}
</style>
