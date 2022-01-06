const graphql = require("graphql");
var _ = require("lodash");
const User = require("../model/user");
const Post = require("../model/post");
const Hobby = require("../model/hobby");

// const usersData = [
//   {
//     id: "1",
//     name: "Galileo",
//     age: 55,
//     profession: "Heretic",
//   },
//   {
//     id: "2",
//     name: "Isaac",
//     age: 47,
//     profession: "Alchemist",
//   },
//   {
//     id: "3",
//     name: "Albert",
//     age: 70,
//     profession: "Artist",
//   },
// ];

// const hobbiesData = [
//   {
//     id: "1",
//     title: "swimming",
//     description: "swimming in the lake",
//     userId: "1",
//   },
//   {
//     id: "2",
//     title: "programming",
//     description: "using computers to make the world a better place",
//     userId: "1",
//   },
//   {
//     id: "3",
//     title: "binge-watching",
//     description: "welcome to the XXI century",
//     userId: "3",
//   },
// ];
// const postsData = [
//   {
//     id: "1",
//     comment: "I love GraphQL",
//     userId: "1",
//   },
//   {
//     id: "2",
//     comment: "I love GraphQL Too!",
//     userId: "2",
//   },
//   {
//     id: "3",
//     comment: "I like trains",
//     userId: "1",
//   },
// ];

// const eventsData = [
//   {
//     id: "1",
//     name: "Coachella",
//     userId: "1",
//   },
//   {
//     id: "2",
//     name: "Burning Man",
//     userId: "2",
//   },
//   {
//     id: "3",
//     name: "PRK God",
//     userId: "1",
//   },
// ];

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql;

// Create types

const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby description",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post description",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

// Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "description",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Hobby.findById(args.id);
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({});
      },
    },
  },
});

// Mutations

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        // id: {type: GraphQLID},
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        // save in mongoDB
        user.save();
        return user;
      },
    },
    UpdateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        profession: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return User.findByIdAndUpdate(
          args.id,
          {
            name: args.name,
            profession: args.profession,
            age: args.age,
          },
          { new: true }
        );
      },
    },
    DeleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return User.findByIdAndDelete(args.id);
      },
    },
    CreatePost: {
      type: PostType,
      args: {
        // id: {type: GraphQLID},
        comment: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let post = new Post({
          comment: args.comment,
          userId: args.userId,
        });
        post.save();
        return post;
      },
    },
    UpdatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Post.findByIdAndUpdate(
          args.id,
          {
            comment: args.comment,
          },
          { new: true }
        );
      },
    },
    CreateHobby: {
      type: HobbyType,
      args: {
        // id: {type: GraphQLID},
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        hobby.save();
        return hobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
