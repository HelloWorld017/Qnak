<template>
	<div id="Archive">
		<qk-topbar :title="board.name"></qk-topbar>
	</div>
</template>

<script>
	import QkTopbar from "../layouts/QkTopbar.vue";

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
			QkTopbar
		}
	};
</script>
