<template>
	<div id="#mprnc">
		<p> Your agent address: {{ agent_address }} </p>
		<Navigator
			v-if="view === 'navigator'"
			:key="current_profile.address"
			v-bind:hc_call_zome="hc_call_zome"
			v-bind:current_profile="current_profile"/>
		<Footer/>
	</div>
</template>

<script>
import LiNavigator from './navigator.vue'

export default {
	data: function() {
		return {
			view: 'navigator',
			new_profile: {
				name: "",
			},
			current_profile: undefined, 
			available_profiles: [],
			agent_address: undefined
		}
	},
	props: {
		hc_call_zome: Function
	},
	created: function() {
		this.refresh_available_profiles()
	},
	methods: {
		refresh_available_profiles: function() {
			this.hc_call_zome(
				'profiles', 
				'get_my_profiles'
			)({}).then(result => {
				result = JSON.parse(result)
				this.available_profiles = result.Ok
				if(this.current_profile == undefined && this.available_profiles !== undefined) {
					this.current_profile = this.available_profiles[0]
				}
			})
		},
		createNewProfile: function(event) {
			this.hc_call_zome(
				'profiles', 
				'create_profile'
			)(this.new_profile).then(result => {
				result = JSON.parse(result) 
				this.refresh_available_profiles()
			})
		}, 
	},
	components: {
		Navigator
	}
}
</script>

<style>

</style>
