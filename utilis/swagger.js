import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Random Mood Sugestion API",
      version: "1.0.0",
      description: "API documentation for Random Mood Sugestion",
    },
    servers: [
      {
        url: "https://mood-based-content-generator-api.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Apply bearerAuth globally to all endpoints
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./services/*.js",
    "./routes/*.js",
    "./controllers/*.js",
    "./index.js"
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;