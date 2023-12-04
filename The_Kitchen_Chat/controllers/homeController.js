module.exports = {
  respondHome: (req, res) => {
    res.render("index");
  },
  showContact: (req, res) => {
    res.render("contacts/contact");
  },
  postedContactForm: (req, res) => {
    res.render("contacts/thanks");
  },
  chat: (req, res) => {
    res.render("chat");
  },
};
