<template>
	<main id="Index">
		<qk-header />

		<div class="QkContainer">
			<qk-tiny-listing></qk-tiny-listing>

			<div class="QkContainer__row">
				<div class="Deans">
				</div>
				<qk-tiny-listing></qk-tiny-listing>
			</div>
		</div>
	</main>
</template>

<style lang="less" scoped>
	#Index {
		flex: 1;
	}
</style>

<script>
	import QkHeader from "../layouts/QkHeader.vue";
	import QkTinyListing from "../layouts/QkTinyListing.vue";
	
	import iziToast from "izitoast";

	export default {
		components: {
			QkHeader,
			QkTinyListing
		},
		
		beforeRouteEnter(to, from, next) {
			document.title = "Qnak";
			next();
		},
		
		async mounted() {
			const {code, state} = this.$route.query;
			
			if(code && state) {
				await this.$store.dispatch('auth/finalize', {code, state});
			}
		}
	};
</script>
