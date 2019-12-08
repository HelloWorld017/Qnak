<template>
	<div id="Archive" v-if="archive">
		<qk-header :context="context" :title="archive.name" />
		
		<div class="Archive__listing">
			<qk-post-item v-for="post in posts" />
			<intersect @enter="scrollMore">
				<a @click="scrollMore">
					{{$t('archive-more')}}
				</a>
			</intersect>
		</div>
	</div>
</template>

<i18n>
{
	"ko": {
		"archive-more": "더 불러오기"
	},
	
	"en": {
		"archive-more": "Load more"
	}
}
</i18n>

<script>
	import Intersect from "vue-intersect";
	import QkHeader from "../layouts/QkHeader.vue";
	import QnakApp from "..";
	
	async function getArchive(archiveName) {
		const archiveSplit = archiveName.split(':');
		
		const archive = {};
		archive.type = archiveSplit[0];
		
		switch(archive.type) {
			case '':
				archive.name = Qnak.i18n.t('all-posts');
				break;
				
			case 'user':
				const uidBase = archiveSplit[1];
				const uidHash = archiveSplit[2];
				const friendlyUid = `${archiveSplit[1]}#${archiveSplit[2]}`;
				
				const user = await QnakApp.request.api(`/user/${uidBase}:${uidHash}`);
				if(!user.ok) throw Error("No such user");
				
				archive.name = user.user.username;
				archive.meta = user.user;
				break;

			case 'college':
				archive.name = archiveSplit[1];
				archive.meta = archiveSplit[1];
				break;
				
			case 'subject':
				const board = await QnakApp.request.api(`/board/${archiveSplit[1]}`);
				if(!board.ok) throw Error("No such board");
				
				archive.name = board.board.title;
				archive.meta = board.board;
				break;
			
			case 'relevant':
				throw new Error("Not implemented");
			
			case 'relevant_post':
				throw new Error("Not implemented");
		}
		
		return archive;
	}
	
	export default {
		data() {
			return {
				archive: null,
				posts: [],
				loading: false,
				page: 0
			};
		},

		computed: {
			context() {
				return this.$route.params.context;
			}
		},
		
		methods: {
			async updateArchive(archive = null) {
				if(!archive) {
					try {
						archive = await getArchive(this.context);
					} catch(e) {
						this.$router.replace('/404');
						return;
					}
				}
				
				this.archive = archive;
			},
			
			async scrollMore() {
				if(this.loading) return;
				this.loading = true;
				
				
				const params = {};
				if(this.$route.query.query)
					params.query = this.$route.query.query;
				
				params.page = this.page;
				
				const postResp = await this.$api(`/archive/${this.context || ''}`, 'get', null, {
					params
				});
				
				if(!postResp.ok) {
					this.loading = false;
					this.$app.error.show('post-show-failed');
					return;
				}
				
				this.posts.push(...postResp.posts);
				this.loading = false;
			}
		},

		async beforeRouteEnter(to, from, next) {
			let archive;
			
			try {
				archive = await getArchive(to.params.context);
			} catch(e) {
				console.log(e);
				next(vm => {
					vm.$router.replace('/404');
				});
				return;
			}
			
			document.title = `Qnak - ${archive.name}`;
			next(vm => {
				vm.archive = archive;
			});
		},
		
		async beforeRouteUpdate(to, from, next) {
			try {
				const archive = await getArchive(to.$route.params.context);
			} catch(e) {
				this.$router.replace('/404');
				next();
				return;
			}
			
			document.title = `Qnak - ${archive.name}`;
			this.archive = archive;
			this.page = 0;
			next();
		},
		
		mounted() {
			this.$nextTick(async () => {
				if(!this.archive) await this.updateArchive();
				this.scrollMore();
			});
		},

		components: {
			Intersect,
			QkHeader
		}
	};
</script>
