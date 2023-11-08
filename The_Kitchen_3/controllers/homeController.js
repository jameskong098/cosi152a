var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50,
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25,
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10,
  },
];

module.exports = {
  showCourses: (req, res) => {
    res.render("courses", {
      offeredCourses: courses,
    });
  },
  respondHome: (req, res) => {
    res.render("index");
  },

  showSignUp: (req, res) => {
    res.render("contact");
  },
  postedSignUpForm: (req, res) => {
    res.render("thanks");
  },
};
