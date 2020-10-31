module.exports = () => {
  const authors = [
    { id: 1, name: "William Gibson" },
    { id: 2, name: "Neil Stephenson" },
  ];
  const projects = [
    {
      slug: "BOOK",
      name: "Book Store",
      description: "Place where books are sold",
    },
    {
      slug: "BUG",
      name: "Bug Tracker",
      description: "System for keep track of reported bugs",
    },
  ];

  const users = [
    {
      name: "Claudia Gonzalez",
      email: "claudiagf_7@hotmail.com",
      usertype: "admin",
    },
    {
      name: "Dave Albert",
      email: "dalbert@cct.ie",
      usertype: "admin",
    },
    {
      name: "Pedro McGowan",
      email: "pedromcgowan@hotmail.com",
      usertype: "user",
    },
  ];

  return {
    authors,
    projects,
    users,
  };
};
