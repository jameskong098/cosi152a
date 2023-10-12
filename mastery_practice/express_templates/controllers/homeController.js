exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName });
};

exports.respondWithBook = (req, res) => {
    let id = req.params.id
    let price = req.params.price
    res.render("index", { id: id, price: price });
};
