module.exports = {
    respondWithAbout: (req, res) => {
        // Show about page view
        res.render("about");
    },
    respondWithContact: (req, res) => {
        // Show Contact page view
        res.render("contact");
    },
    chat: (req, res) => {
        // Show chat page
        res.render("chat");
    },
    respondWithIndex: (req, res) => {
        // Show home page view
        res.render('index');
    },
    redirectView: (req, res, next) => {
        // Given a path, redirect to that path
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}
