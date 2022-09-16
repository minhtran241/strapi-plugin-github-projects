"use strict";

module.exports = ({ strapi }) => ({
  index: async (ctx) => {
    ctx.body = await strapi
      .plugin("github-projects")
      .service("getReposService")
      .getPublicRepos();
  },
});
