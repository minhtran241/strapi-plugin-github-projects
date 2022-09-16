"use strict";

const { request } = require("@octokit/request");
const axios = require("axios");
const md = require("markdown-it")();

module.exports = ({ strapi }) => ({
  getProjectForRepo: async (repo) => {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );
    if (matchingProjects.length === 1) return matchingProjects[0].id;
    return null;
  },

  getPublicRepos: async () => {
    const result = (
      await request("GET /user/repos", {
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
        type: "public",
      })
    ).data;

    //https://raw.githubusercontent.com/minhtran241/natours-international/main/README.md

    const data = result.map(async (item) => {
      const { id, name, description, html_url, owner, default_branch } = item;
      const longDescription = await axios
        .get(
          `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`
        )
        .then((res) => md.render(res.data).replaceAll("\n", "<br/>"))
        .catch((e) => console.error(e));

      const repo = {
        id,
        name,
        shortDescription: description,
        url: html_url,
        longDescription: longDescription
          ? longDescription
          : "README.md not found",
      };

      // Add some logic to search for an existing project for current repo
      const relatedProjectId = await strapi
        .plugin("github-projects")
        .service("getReposService")
        .getProjectForRepo(repo);
      return {
        ...repo,
        projectId: relatedProjectId,
      };
    });

    return Promise.all(data);
  },
});
