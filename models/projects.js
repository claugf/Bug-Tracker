const db = require("../db.js")();

module.exports = () => {
  const get = (slug = null) => {
    console.log("   inside projects model");
    if (!slug) {
      return db.projects;
    }

    return db.projects[parseInt(id) - 1];
  };

  const add = (slug, name, description) => {
    return db.projects.push({
      slug: slug,
      name: name,
      description: description,
    });
  };

  return {
    get,
    add,
  };
};
