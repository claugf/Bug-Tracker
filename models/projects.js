const db = require("../db.js")();
const COLLECTION = "projects";

module.exports = () => {
  const get = async (slug = null) => {
    console.log("   inside projects model");
    const projects = await db.get(COLLECTION);

    if (!slug) {
      return projects;
    }

    return projects;
  };

  const add = async (slug, name, description) => {
    const results = await db.add(COLLECTION, {
      slug: slug,
      name: name,
      description: description,
    });
    return results.result;
  };

  return {
    get,
    add,
  };
};
