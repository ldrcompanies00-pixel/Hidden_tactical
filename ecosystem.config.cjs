module.exports = {
  apps: [
    {
      name: "hidden-ops-platform",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
