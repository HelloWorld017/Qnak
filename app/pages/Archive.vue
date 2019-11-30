<template>
	<div id="Archive">
		<qk-header :title="board.name"></qk-header>
	</div>
</template>

<script>
	import QkHeader from "../layouts/QkHeader.vue";

	export default {
		data() {
			return {
				board: {},
				users: {},
				posts: [],
				pagination: {}
			};
		},

		computed: {
			context() {
				return this.$router.route.params.context;
			}
		},

		mounted() {

		},

		components: {
			QkHeader
		}
	};
</script>
