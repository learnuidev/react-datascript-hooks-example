const userSchema = {
  "user/email": {
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
  "tweet/likes": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
  "tweet/author": {
    ":db/cardinality": ":db.cardinality/one",
    ":db/valueType": ":db.type/ref",
  },
  "tweet/tweets": {
    ":db/cardinality": ":db.cardinality/many",
    ":db/valueType": ":db.type/ref",
  },
};

const schema = {
  ...userSchema,
  ...uiSchema,
  ...tweetSchema,
};

export default schema;
