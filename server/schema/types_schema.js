const graphql = require("graphql");
var _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
} = graphql;

// Scalar Types => a type that olds one value (...a primitive)
/*
String
int
Float
Boolean
ID 
*/

const CoordinatesType = new GraphQLObjectType({
  name: "Coordinates",
  description: "Represents Geo coordinates",
  fields: () => ({
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
  }),
});

const PersonType = new GraphQLObjectType({
  name: "Person",
  description: "Represents a person type",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    isMarried: { type: GraphQLBoolean },
    gpa: { type: GraphQLFloat },
    coordinates: {
      type: CoordinatesType,
      resolve(parent, args) {
        let coordinates = {
          lat: 45.009763,
          lng: 7.655372,
        };
        return coordinates;
      },
    },
  }),
});

// Root query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    person: {
      type: PersonType,
      resolve(parent, args) {
        let personObj = {
          name: null,
          age: 27,
          isMarried: false,
          gpa: 9.8,
        };
        return personObj;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
