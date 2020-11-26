const db = require("../db.js")();
const COLLECTION = "issues";
const COLLECTION_PARENT = "projects";
const nodemailer = require("nodemailer");

module.exports = () => {
  const get = async (issueNumber = null) => {
    console.log("   inside issues model");
    // In case number is null, all issues are given
    if (!issueNumber) {
      try {
        const issues = await db.get(COLLECTION);
        return { issuesResult: issues };
      } catch (ex) {
        console.log("-=-=-=-= Issues Get Error");
        return { error: ex };
      }
    }

    //  In case number is set, we pass it by param
    try {
      const issue = await db.get(COLLECTION, { issueNumber });
      return { issuesResult: issue };
    } catch (ex) {
      console.log("-=-=-=-= Issue Get Error");
      return { error: ex };
    }
  };

  const add = async (title, description, status, slug) => {
    //  Ask for all the paramereters before add it
    if (
      title != null &&
      description != null &&
      status != null &&
      slug != null
    ) {
      //    Firstly, search the project by slug
      let projectFind;
      try {
        projectFind = await db.get(COLLECTION_PARENT, { slug });
      } catch (ex) {
        console.log("-=-=-=-= Issues Add/Get projectFind Error");
        return { error: ex };
      }

      //  Checking if the project exists, to continue
      if (Array.isArray(projectFind) && projectFind.length) {
        //  Taking the project Id of the project found
        const project_id = projectFind[0]._id;

        //  Getting issues by Project
        let issuesCount;
        try {
          const issuesProject = await db.get(COLLECTION, { project_id });
          issuesCount = issuesProject.length;
        } catch {
          console.log("-=-=-=-= Issues Add/Get issuesProject Error");
          return { error: ex };
        }

        //  Adding the issue
        try {
          const results = await db.add(COLLECTION, {
            issueNumber: slug + "-" + (issuesCount + 1),
            title: title,
            description: description,
            status: status,
            project_id: project_id,
          });
          return { issuesResult: results.result };
        } catch (ex) {
          console.log("-=-=-=-= Issue Add Error");
          return { error: ex };
        }
      } else {
        //  If the project does not exist, return error
        return {
          error:
            "The project does not exist in the database. Please add the project first, then try again!",
        };
      }
    } else {
      return {
        error: "Please fill out all required fields to add the issue!",
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
          status: 1,
          project: {
            $arrayElemAt: ["$p.slug", 0],
          },
        },
      },
    ];

    try {
      const issues = await db.aggregate(COLLECTION, LOOKUP_PROJECTS_PIPELINE);
      return { issuesResult: issues };
    } catch (ex) {
      console.log("-=-=-=-= Issues Aggregate Error");
      return { error: ex };
    }
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
      try {
        const issues = await db.aggregate(COLLECTION, COMMENTS_ISSUES_PIPELINE);
        return { issuesResult: issues };
      } catch (ex) {
        console.log("-=-=-=-= Issue GetComments Error");
        return { error: ex };
      }
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
    try {
      const issue = await db.aggregate(COLLECTION, COMMENTS_ISSUE_PIPELINE);
      return { issuesResult: issue };
    } catch (ex) {
      console.log("-=-=-=-= Issue GetCommentsByIssue Error");
      return { error: ex };
    }
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
            $arrayElemAt: ["$comments.text", parseInt(index - 1)],
          },
        },
      },
    ];
    try {
      const issue = await db.aggregate(COLLECTION, COMMENT_PIPELINE);
      return { issuesResult: issue };
    } catch (ex) {
      console.log("-=-=-=-= Issue GetComment Error");
      return { error: ex };
    }
  };

  const addComment = async (issueNumber, text, author) => {
    //  Ask for all the paramereters before add it
    if (issueNumber != null && text != null && author != null) {
      //    Firstly, search the project by slug
      let issueFind;
      try {
        issueFind = await getCommentsByIssue(issueNumber);
      } catch (ex) {
        console.log("-=-=-=-= Issue AddComment/GetComment Error");
        return { error: ex };
      }

      //  Checking if the project exists, to continue
      if (
        Array.isArray(issueFind.issuesResult) &&
        issueFind.issuesResult.length
      ) {
        //  Counting comments in the issue
        let commentsByIssue;
        try {
          //  If the issue have comments, it will count have many they are
          commentsByIssue = issueFind.issuesResult[0].comments.length;
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
        try {
          const comment = await db.update(
            COLLECTION,
            NEW_COMMENT_PIPELINE,
            NEW_COMMENT_ITEM
          );

          //  Prepare list of receivers/watchers
          const receivers = await getReceivers(issueNumber);
          //  If there are watchers, it proceeds to send emails
          if (receivers.receivers != "") {
            //  Prepare body of the email
            const emailBody = `
            <p>You have a new email from Bug-Tracker App</p>
            <h2>${issueNumber}</h2>
            <p> An comment was added by ${author}</p>
            <p>${text}</p>
            `;
            // Sending Email
            await sendEmail(emailBody, receivers.receivers);
          }

          return { issuesResult: comment };
        } catch (ex) {
          console.log("-=-=-=-= Issue AddComment Error");
          return { error: ex };
        }
      } else {
        //  If the project does not exist, return error
        return {
          error:
            "The issue does not exist in the database. Please add the issue first, then try again!",
        };
      }
    } else {
      return {
        error: "Please fill out all required fields to add the comment!",
      };
    }
  };

  const getReceivers = async (issueNumber) => {
    // In case number is set, all comments of the selected Issue will be shown
    const COMMENTS_ISSUE_PIPELINE = [
      {
        $match: { issueNumber: issueNumber },
      },
      {
        $project: {
          watchers: 1,
        },
      },
    ];
    try {
      const watchers = await db.aggregate(COLLECTION, COMMENTS_ISSUE_PIPELINE);
      let receivers = "";
      if (watchers[0].watchers) {
        watchers[0].watchers.forEach((watcher) => {
          receivers += watcher.watcher + "; ";
        });
      }
      return { receivers: receivers };
    } catch (ex) {
      console.log("-=-=-=-= Issue getReceivers Error");
      return { error: ex };
    }
  };
  const sendEmail = async (emailBody, receivers) => {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "claudia.cbwa@gmail.com",
        pass: "CBWA2020",
      },
    });

    const mailOptions = {
      from: "claudia.cbwa@gmail.com", // sender address
      to: receivers, // list of receivers
      subject: "Bug-Tracker App Notification", // Subject line
      html: emailBody, //'<h1>this is a test mail.</h1>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  };

  const addWatcher = async (issueNumber, watcher) => {
    //  Ask for all the paramereters before add it
    if (issueNumber != null && watcher != null) {
      //    Firstly, search the project by slug
      let issueFind;
      try {
        issueFind = await getCommentsByIssue(issueNumber);
      } catch (ex) {
        console.log("-=-=-=-= Issue addWatcher/GetComment Error");
        return { error: ex };
      }

      //  Checking if the project exists, to continue
      if (
        Array.isArray(issueFind.issuesResult) &&
        issueFind.issuesResult.length
      ) {
        //  Setting pipeline and item
        const NEW_COMMENT_PIPELINE = { issueNumber: issueNumber };
        const NEW_COMMENT_ITEM = {
          $push: {
            watchers: {
              $each: [{ watcher: watcher }],
            },
          },
        };

        //  Adding the comment
        try {
          const comment = await db.update(
            COLLECTION,
            NEW_COMMENT_PIPELINE,
            NEW_COMMENT_ITEM
          );
          return { issuesResult: comment };
        } catch (ex) {
          console.log("-=-=-=-= Issue addWatcher Error");
          return { error: ex };
        }
      } else {
        //  If the project does not exist, return error
        return {
          error:
            "The issue does not exist in the database. Please add the issue first, then try again!",
        };
      }
    } else {
      return {
        error: "Please fill out all required fields to add the watcher!",
      };
    }
  };

  const updateStatus = async (issueNumber, status) => {
    //    Firstly, search the project by slug
    let issueFind;
    try {
      issueFind = await getCommentsByIssue(issueNumber);
    } catch (ex) {
      console.log("-=-=-=-= Issue UpdateStatus/GetComment Error");
      return { error: ex };
    }

    //  Checking if the project exists, to continue
    if (
      Array.isArray(issueFind.issuesResult) &&
      issueFind.issuesResult.length
    ) {
      //  Ask for all the paramereters before add it
      if (issueNumber != null && status != null) {
        //  Setting pipeline and item
        const NEW_COMMENT_PIPELINE = { issueNumber: issueNumber };
        const NEW_COMMENT_ITEM = {
          $set: {
            status: status,
          },
        };

        //  Adding the comment
        try {
          const comment = await db.update(
            COLLECTION,
            NEW_COMMENT_PIPELINE,
            NEW_COMMENT_ITEM
          );

          //  Prepare list of receivers/watchers
          const receivers = await getReceivers(issueNumber);
          //  If there are watchers, it proceeds to send emails
          if (receivers.receivers != "") {
            //  Prepare body of the email
            const emailBody = `
            <p>You have a new email from Bug-Tracker App</p>
            <h2>${issueNumber}</h2>
            <p> The status of this issue has been changed to</p>
            <h3>${status}</h3>
            `;
            // Sending Email
            await sendEmail(emailBody, receivers.receivers);
          }

          return { issuesResult: comment };
        } catch (ex) {
          console.log("-=-=-=-= Issue UpdateStatus Error");
          return { error: ex };
        }
      } else {
        return {
          error: "Please fill out all required fields to update the issue!",
        };
      }
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
    addWatcher,
    updateStatus,
  };
};
