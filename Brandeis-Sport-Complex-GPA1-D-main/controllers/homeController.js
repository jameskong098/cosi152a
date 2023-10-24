exports.respondWithAbout = (req, res) => {
    res.render("about");
};

exports.respondWithContact = (req, res) => {
    res.render("contact");
};

exports.respondWithEvents = (req, res) => {
    res.render("events");
};

exports.respondWithFacilities = (req, res) => {
    res.render("facilities");
};

exports.respondWithHome = (req, res) => {
    res.render("home");
};

exports.respondWithMembership = (req, res) => {
    res.render("membership");
};

exports.respondWithPrograms = (req, res) => {
    res.render("programs");
};

exports.postedContactForm = (req, res) => {
    res.render("thanks");
};
