const graphql = require("graphql");
var _ = require("lodash");

const usersData = [
  {
    id: "1",
    name: "Galileo",
    age: 55,
    profession: "Heretic",
  },
  {
    id: "2",
    name: "Isaac",
    age: 47,
    profession: "Alchemist",
  },
  {
    id: "3",
    name: "Albert",
    age: 70,
    profession: "Artist",
  },
];

const hobbiesData = [
  {
    id: "1",
    title: "swimming",
    description: "swimming in the lake",
    userId: "1",
  },
  {
    id: "2",
    title: "programming",
    description: "using computers to make the world a better place",
    userId: "1",
  },
  {
    id: "3",
    title: "binge-watching",
    description: "welcome to the XXI century",
    userId: "3",
  },
];
const postsData = [
  {
    id: "1",
    comment: "I love GraphQL",
    userId: "1",
  },
  {
    id: "2",
    comment: "I love GraphQL Too!",
    userId: "2",
  },
  {
    id: "3",
    comment: "I like trains",
    userId: "1",
  },
];

const eventsData = [
  {
    id: "1",
    name: "Coachella",
    userId: "1",
  },
  {
    id: "2",
    name: "Burning Man",
    userId: "2",
  },
  {
    id: "3",
    name: "PRK God",
    userId: "1",
  },
];

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = graphql;

// Create types

const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return _.filter(postsData, { userId: parent.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return _.filter(hobbiesData, { userId: parent.id });
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
        return _.find(usersData, { id: parent.userId });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post description",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId });
      },
    },
  }),
});

const EventType = new GraphQLObjectType({
  name: "Event",
  description: "Event description",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId });
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
        // resolve with data
        // get and return data from datasource
        return _.find(usersData, { id: args.id });
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(hobbiesData, { id: args.id });
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(postsData, { id: args.id });
      },
    },
    event: {
      type: EventType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(eventsData, { id: args.id });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return usersData;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return postsData;
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbiesData;
      },
    },
  },
});

// Mutations

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        // id: {type: GraphQLID},
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        let user = {
          name: args.name,
          age: args.age,
          profession: args.profession,
        };
        return user;
      },
    },
    createPost: {
      type: PostType,
      args: {
        // id: {type: GraphQLID},
        comment: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let post = {
          comment: args.comment,
          userId: args.userId,
        };
        return post;
      },
    },
    createHobby: {
      type: HobbyType,
      args: {
        // id: {type: GraphQLID},
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let hobby = {
          title: args.title,
          description: args.description,
          userId: args.userId,
        };
        return hobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
