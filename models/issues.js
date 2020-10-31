const db = require("../db.js")();
const COLLECTION = "issues";
const COLLECTION_PARENT = "projects";

module.exports = () => {
  const get = async (issueNumber = null) => {
    console.log("   inside issues model");
    // In case number is null, all issues are given
    if (!issueNumber) {
      const issues = await db.get(COLLECTION);
      return issues;
    }

    //  In case number is set, we pass it by param
    const issue = await db.get(COLLECTION, { issueNumber });
    return issue;
  };

  const add = async (title, description, status, slug) => {
    //    Firstly, search the project by slug
    const projectFind = await db.get(COLLECTION_PARENT, { slug });

    //  Checking if the project exists, to continue
    if (Array.isArray(projectFind) && projectFind.length) {
      //  Taking the project Id of the project found
      const project_id = projectFind[0]._id;

      //  Getting issues by Project
      const issuesProject = await db.get(COLLECTION, { project_id });
      const issuesCount = issuesProject.length;

      //  Adding the issue
      const results = await db.add(COLLECTION, {
        issueNumber: slug + "-" + (issuesCount + 1),
        title: title,
        description: description,
        status: status,
        project_id: project_id,
      });
      return results.result;
    } else {
      //  If the project does not exist, return error
      return {
        error:
          "The project does not exist in the database. Please add the project first, then try again!",
      };
    }
  };

  return {
    get,
    add,
  };
};
