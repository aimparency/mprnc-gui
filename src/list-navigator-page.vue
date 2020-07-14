<template>
	<div class="page">
	</div>
</template>

<script>
import AimDetails from './aim-details.vue'
import AimList from './aim-list.vue'

export default {
	data: function() {
		return {
			page
		}
	},
	props: {
		hc_call_zome: Function,
	},
	created: function() {
		this.hc_call_zome('aims', 'get_root_aim_address_or_create')({}).then(result => {
			result = JSON.parse(result)
			console.log("get root aim address result", result)
			this.pages = [{
				mode: 'hidden',
				slot: 0
			},{
				mode: 'empty',
				slot: 1
			},{
				mode: 'list',
				slot: 2, 
				settings: { 
					connectedTo: result.Ok, 
					relation: 'receiving',
					hightlight: undefined, 
				}
			},{
				mode: 'details', 
				slot: 3, 
				settings: {
					aimAddress: result.Ok, 
				}
			},{
				mode: 'list',
				slot: 4, 
				settings: {
					connectedTo: result.Ok,
					relation: 'contributing',
					hightlight: undefined, 
				}
			},{
				mode: 'empty', 
				slot: 5, 
			},{
				mode: 'hidden',
				slot: 6
			}]
		})
	},
	methods: {
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
	background-color: #7772;
	border-radius: 0.5vw; 
	transition: left 0.3s; 
}

.overlay {
	position: absolute; 
	width: $slot-width; 
	height: 100%; 
	background-color: #f006;
}

@for $i from 0 through 6 {
	.slot#{$i}) {
		left: ($i - 2) * ($slot-spacing + $slot-width) + $slot-spacing;
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
