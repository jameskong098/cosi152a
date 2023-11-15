module.exports = {
    respondWithAbout: (req, res) => {
        res.render("about");
    },
    respondWithContact: (req, res) => {
        res.render("contact");
    },
    respondWithIndex: (req, res) => {
        res.render('index');
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}
