<template>
	<div id="Index">
		<qk-topbar></qk-topbar>

		<div class="QkContainer">
			<qk-tiny-listing></qk-tiny-listing>

			<div class="QkContainer__row">
				<div class="Deans">
				</div>
				<qk-tiny-listing></qk-tiny-listing>
			</div>
		</div>
	</div>
</template>

<script>
	import QkTinyListing from "../layouts/QkTinyListing.vue";
	import QkTopbar from "../layouts/QkTopbar.vue";

	export default {
		components: {
			QkTinyListing,
			QkTopbar
		}
	};
</script>
