const router = require("express").Router();
const sqlite3 = require("sqlite3");

function OpenDatabase() {
    return new sqlite3.Database("../spy.db");
}

router.route("/").get((req, res) => {
    console.log("okay")
    let db = OpenDatabase();
    let stmt = "SELECT * FROM Agent;";
    db.all(stmt, (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(rows);
        rows.forEach((row) => {
            console.log(row);
        })
    })
    db.close();
})

module.exports = router;