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

  const aggregateWithProjects = async (slug) => {
    //  Creating the query to filter by project
    const LOOKUP_PROJECTS_PIPELINE = [
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "p",
        },
      },
      {
        $match: { "p.slug": slug },
      },
      {
        $project: {
          issueNumber: 1,
          title: 1,
          description: 1,
          project: {
            $arrayElemAt: ["$p.slug", 0],
          },
        },
      },
    ];
    const issues = await db.aggregate(COLLECTION, LOOKUP_PROJECTS_PIPELINE);
    return issues;
  };

  const getCommentsByIssue = async (issueNumber = null) => {
    // In case number is null, all comments will be shown by Issue
    if (!issueNumber) {
      const COMMENTS_ISSUES_PIPELINE = [
        {
          $project: {
            comments: 1,
          },
        },
      ];
      const issues = await db.aggregate(COLLECTION, COMMENTS_ISSUES_PIPELINE);
      return issues;
    }
    // In case number is set, all comments of the selected Issue will be shown
    const COMMENTS_ISSUE_PIPELINE = [
      {
        $match: { issueNumber: issueNumber },
      },
      {
        $project: {
          comments: 1,
        },
      },
    ];
    const issue = await db.aggregate(COLLECTION, COMMENTS_ISSUE_PIPELINE);
    return issue;
  };

  const getAComment = async (issueNumber, index) => {
    // In case number is set, all comments of the selected Issue will be shown
    const COMMENT_PIPELINE = [
      {
        $match: { issueNumber: issueNumber },
      },
      {
        $project: {
          comment: {
            $arrayElemAt: ["$comments.text", parseInt(index)],
          },
        },
      },
    ];
    const issue = await db.aggregate(COLLECTION, COMMENT_PIPELINE);
    return issue;
  };

  const addComment = async (issueNumber, text, author) => {
    //    Firstly, search the project by slug
    const issueFind = await getCommentsByIssue(issueNumber);

    //  Checking if the project exists, to continue
    if (Array.isArray(issueFind) && issueFind.length) {
      //  Counting comments in the issue
      let commentsByIssue;
      try {
        //  If the issue have comments, it will count have many they are
        commentsByIssue = issueFind[0].comments.length;
      } catch (error) {
        //  If the issue does not have comments, it will assign  zero
        commentsByIssue = 0;
      }

      //  Setting pipeline and item
      const NEW_COMMENT_PIPELINE = { issueNumber: issueNumber };
      const NEW_COMMENT_ITEM = {
        $push: {
          comments: {
            $each: [{ _id: commentsByIssue + 1, text: text, author: author }],
          },
        },
      };

      //  Adding the comment
      const comment = await db.update(
        COLLECTION,
        NEW_COMMENT_PIPELINE,
        NEW_COMMENT_ITEM
      );
      return comment;
    } else {
      //  If the project does not exist, return error
      return {
        error:
          "The issue does not exist in the database. Please add the issue first, then try again!",
      };
    }
  };

  const updateStatus = async (issueNumber, status) => {
    //    Firstly, search the project by slug
    const issueFind = await getCommentsByIssue(issueNumber);

    //  Checking if the project exists, to continue
    if (Array.isArray(issueFind) && issueFind.length) {
      //  Setting pipeline and item
      const NEW_COMMENT_PIPELINE = { issueNumber: issueNumber };
      const NEW_COMMENT_ITEM = {
        $set: {
          status: status,
        },
      };

      //  Adding the comment
      const comment = await db.update(
        COLLECTION,
        NEW_COMMENT_PIPELINE,
        NEW_COMMENT_ITEM
      );
      return comment;
    } else {
      //  If the project does not exist, return error
      return {
        error:
          "The issue does not exist in the database. Please add the issue first, then try again!",
      };
    }
  };

  return {
    get,
    add,
    aggregateWithProjects,
    getCommentsByIssue,
    getAComment,
    addComment,
    updateStatus,
  };
};
