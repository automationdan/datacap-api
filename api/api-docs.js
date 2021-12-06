const apiDoc = {
  swagger: "2.0",
  basePath: "/",
  info: {
    title: "DataCap NodeJS API",
    version: "1.0.0",
  },
  definitions: {
    uploadAndPrepare: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        message: {
          type: "string",
        },
      },
      required: ["id", "message"],
    },
  },
  paths: {},
};

module.exports = apiDoc;
