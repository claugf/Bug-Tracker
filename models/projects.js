const db = require("../db.js")();
const COLLECTION = "projects";

module.exports = () => {
  const get = async (slug = null) => {
    console.log("   inside projects model");
    // In case slug is null, all projects are given
    if (!slug) {
      const projects = await db.get(COLLECTION);
      return projects;
    }

    //  In case slug is set, we pass it by param
    const project = await db.get(COLLECTION, { slug });
    return project;
  };

  const add = async (slug, name, description) => {
    //  Getting projects by Slug
    const projects = await get(slug);

    //  Checking if the project already exists
    if (projects.length === 0) {
      const results = await db.add(COLLECTION, {
        slug: slug,
        name: name,
        description: description,
      });
      return results.result;
    }

    return { error: "This project already exists in the database!" };
  };

  return {
    get,
    add,
  };
};
