exports.respondWithAbout = (req, res) => {
    res.render("about");
};

exports.respondWithContact = (req, res) => {
    res.render("contact");
};

exports.respondWithError = (req, res) => {
    res.render("error");
};

exports.respondWithEvents = (req, res) => {
    res.render("events");
};

exports.respondWithIndex = (req, res) => {
    res.render("index");
};

exports.respondWithJobs = (req, res) => {
    res.render("jobs");
};

