const NeDB = require("nedb");
const service = require("feathers-nedb");

// Create a NeDB instance
const Posts = service({
	Model: new NeDB({
		filename: "./data/posts.db",
		autoload: true
	})
});

// Create a NeDB instance
const Users = service({ 
	Model: new NeDB({
		filename: "./data/users.db",
		autoload: true
	})
});

module.exports = {
	users: {
		feathers: {
			path: "/users",
			service: Users
		},
		fields: {
			_id: 1,
			name: 1,
			posts: "posts"
		},
		computed: {
			posts(user){
				return Posts.find({
					query: { posterId: user._id }
				});
			}
		}
	},
	posts: {
		feathers: {
			path: "/posts",
			service: Posts
		},
		fields: {
			_id: 1,
			message: 1,
			poster: "users",
			readers: "users"
		},
		computed: {
			poster(post) {
				return Users.get(post.posterId);
			},
			readers(post){
				return Users.find({
					query: {
						_id: {$in: post.readerIds}
					}
				})
			}
		}
	}
};