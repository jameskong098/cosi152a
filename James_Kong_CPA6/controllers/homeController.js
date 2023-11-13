module.exports = {
    respondWithAbout: (req, res) => {
        res.render("about");
    },
    respondWithContact: (req, res) => {
        res.render("contact");
    },
    respondWithIndex: (req, res) => {
        res.render('index');
    }
}
