const userSchema = {
  "user/email": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },
  "user/handle": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },
  "user/follows": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },

  "user/tweets": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
};

const uiSchema = {
  "ui/id": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },
  "ui/auth-user": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/valueType": ":db.type/ref",
  },
};

// Tweet Schema
// - // id
// - // tweet
// - // last-updated

const tweetSchema = {
  "tweet/id": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },

  "tweet/author": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/valueType": ":db.type/ref",
  },
  "tweet/likes": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
  "tweet/replies": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
  "tweet/retweets": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
};

// Poll
// - id
// - question
// - options

// Option
// - id
// - value
// - votes

const pollSchema = {
  "poll/id": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },
  "poll/options": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },

  "option/id": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/unique": ":db.unique/identity",
  },
  "option/votes": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/unique": ":db.unique/identity",
  },
};

const schema = {
  ...userSchema,
  ...uiSchema,
  ...tweetSchema,
  ...pollSchema,
};

export default schema;
