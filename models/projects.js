const db = require("../db.js")();
const COLLECTION = "projects";

module.exports = () => {
  const get = async (slug = null) => {
    // In case slug is null, all projects are given
    if (!slug) {
      try {
        const projects = await db.get(COLLECTION);
        return { projectsResult: projects };
      } catch (ex) {
        console.log("-=-=-=-= Projects Get Error");
        return { error: ex };
      }
    }

    //  In case slug is set, we pass it by param
    try {
      const project = await db.get(COLLECTION, { slug });
      return { projectsResult: project };
    } catch (ex) {
      console.log("-=-=-=-= Project Get Error");
      return { error: ex };
    }
  };

  const add = async (slug, name, description) => {
    //  Ask for all the paramereters before add it
    if (slug != null && name != null && description != null) {
      //  Getting projects by Slug
      let projects;
      try {
        projects = await get(slug);
      } catch (ex) {
        console.log("-=-=-=-= Projects Add/Get Error");
        return { error: ex };
      }

      //  Checking if the project already exists
      if (projects.projectsResult.length === 0) {
        try {
          const results = await db.add(COLLECTION, {
            slug: slug,
            name: name,
            description: description,
          });
          return { projectsResult: results.result };
        } catch (ex) {
          console.log("-=-=-=-= Project Add Error");
          return { error: ex };
        }
      } else {
        //  If we reach this point is because the project already exists
        return { error: "This project already exists in the database!" };
      }
    } else {
      return {
        error: "Please fill out all required fields to add the project!",
      };
    }
  };

  return {
    get,
    add,
  };
};
