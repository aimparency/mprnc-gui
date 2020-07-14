<template>
	<div 
		class="cropper"
		>
		<div :class="{navigator: true, right: show_right}">
			<div 
				:class="{slot: true, ['position' + slot.position]: true}"
				v-for="slot, i in slots" 
				:key="i"
				>
				<component 
					v-if="slot.mode == 'page'"
					v-bind:is="slot.page.type"
					v-bind:settings="slot.page.settings"
					v-bind:switch_page="switch_page_fn(i)"
					v-bind:hc_call_zome="hc_call_zome"
					v-bind:view_details="view_details_fn(i)"
					:key="center_index"
					/>
			</div>
			<div
				v-on:click="shift"
				:class="{overlay: true, ['position' + (center_slot + (show_right ? -1 : 1))]: true}">
			</div>
		</div>
	</div>
</template>

<script>
import Utils from './utils.js'
import AimDetails from './aim-details.vue'
import AimList from './aim-list.vue'

export default {
	data: function() {
		return {
			slots: [],
			center_slot: 2,
			center_index: 2, 
			show_right: true,
		}
	},
	props: {
		hc_call_zome: Function,
	},
	created: function() {
		this.hc_call_zome('aims', 'get_root_aim_address_or_create')({}).then(result => {
			result = JSON.parse(result)
			console.log("get root aim address result", result)
			this.setUpSlots(2, result.Ok)
		})
	},
	methods: {
		view_details_fn: function(i) {
			return (aim_address) => {
				this.setUpSlots(i, aim_address)
			}
		},
		switch_page_fn: function(i) {
			return (page, stack) => {
				this.switchPage(i, page, stack)
			}
		},
		setUpSlots: function(center_index, aim_address) {
			console.log("viewing aim", aim_address)
			
			let slot_index = (offset) => {return (2 - center_index + offset + 5) % 5 }
			let page_index = slot_index	

			console.log("old slots", this.slots)

			this.center_index = center_index

			let pages = [{
				mode: 'empty',
			},{
				mode: 'page',
				page: {
					type: 'aim-list', 
					settings: {
						connected_to: aim_address, 
						relation: 'receiving',
						hightlight: undefined, 
					}
				}
			},{
				mode: 'page', 
				page: {
					type: 'aim-details',
					settings: {
						aim_address: aim_address, 
					}
				}
			},{
				mode: 'page',
				page: {
					type: 'aim-list', 
					settings: {
						connected_to: aim_address, 
						relation: 'contributing',
						hightlight: undefined, 
					}
				}
			},{
				mode: 'empty', 
			}]

			this.slots = [{
				position: slot_index(0),
				...pages[page_index(0)]
			},{
				position: slot_index(1), 
				...pages[page_index(1)]
			},{
				position: slot_index(2), 
				...pages[page_index(2)]
			},{
				position: slot_index(3), 
				...pages[page_index(3)]
			},{
				position: slot_index(4), 
				...pages[page_index(4)]
			}]
			console.log("new slots", this.slots)
		},
		switchPage: function(i, page) {
			console.log("switching page!") 
			if(this.slots[i].mode == 'page') {
				this.slots[i].page = page
				this.slots = this.slots; // retrigger vue
			}
		}, 
		shift: function() {
			this.show_right = !this.show_right
		},
		formatEffort: function() {
		}
	},
	components: {
		AimDetails, 
		AimList
	}
}
</script>

<style lang="scss">
$debug-slots: false;

$slot-spacing: 3%; 
$slot-width: 50% - 2 * $slot-spacing;

.cropper {
@if $debug-slots {
	transform:  scale(0.2); 
} @else {
	overflow:hidden;
}
	width: 100vw; 
}

.navigator {
	position:absolute;
	left: 0vw; 
	top: 10vh; 
	width: 100vw; 
	height: 80vh; 
	transition: left 0.3s;
}

.navigator.right {
	left: -$slot-width;
}

.slot {
	position: absolute; 
	width: $slot-width; 
	height: 100%;
	top: 0%; 
	transition: left 0.3s; 
}

.overlay {
	position: absolute; 
	border-radius: 0.5rem; 
	width: $slot-width; 
	height: 100%; 
	background-color: #fff4;
	cursor: pointer; 
}

@for $i from 0 through 6 {
	.navigator .position#{$i}) {
		left: ($i - 1) * ($slot-spacing + $slot-width) + $slot-spacing;
	}
}

input, button, select, textarea, [contenteditable="true"] {
	padding: 0.3rem; 
	margin: 0.5rem; 
	border-radius: 0.3rem;
	border: none;
	background-color:#fff2;
	color:#fff; 
	font-size: 1rem;
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
