const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, './public')));

if (!(!process.env.NODE_ENV || process.env.NODE_ENV === "development")) {
    app.use(express.static(path.join(__dirname, './build')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './build/index.html'));
    });
}

function OpenDatabase() {
    return new sqlite3.Database("./Spy.db");
}

app.route("/api/agent").get((req, res) => {
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

app.route("/api/mission").get((req, res) => {
    let db = OpenDatabase();
    let stmt = "SELECT * FROM Mission;";
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

app.route("/api/mission/locations").get((req, res) => {
    let db = OpenDatabase();
    let stmt = "SELECT DISTINCT Location FROM Mission;";
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

app.route("/api/mission/agent").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT Mission.AgentID, Mission.Location, Mission.Outcome, Mission.Date FROM Mission JOIN Agent ON Agent.id = Mission.AgentID WHERE Agent.Realname = "${req.query.name}";`;
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

app.route("/api/agent/withID").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT * FROM Agent WHERE id LIKE "${req.query.id}%";`;
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

app.route("/api/agent/deployed").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT Agent.id, Agent.Realname, Agent.Codename FROM Agent JOIN Mission ON Agent.id = Mission.AgentID WHERE Mission.Location = "${req.query.location}";`;
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

app.route("/api/agent/deployed/team").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT Mission.Location FROM Mission JOIN Agent ON Agent.id = Mission.AgentID WHERE Agent.Codename LIKE "%${req.query.team}";`;
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

app.route("/api/agent/withCodename").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT * FROM Agent WHERE Codename LIKE "${req.query.codename}%";`;
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

app.route("/api/agent/team").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT * FROM Agent WHERE Codename LIKE "%${req.query.team}";`;
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

app.route("/api/agent/id").get((req, res) => {
    let db = OpenDatabase();
    let stmt = `SELECT Realname FROM Agent WHERE id = "${req.query.id}";`;
    db.all(stmt, (err, rows) => {
        if (err) {
            console.error(err);
            res.send(`${req.query.name} is not an agent`);
            return;
        }
        res.send(rows[0]);
        console.log(rows[0]);
    })
    db.close();
})

app.route("/api/agent/name").get((req, res) => {
    let db = OpenDatabase();
    console.log(req.query.name);
    let stmt = `SELECT * FROM Agent WHERE Realname = "${req.query.name}";`;
    db.all(stmt, (err, rows) => {
        if (err) {
            console.error(err);
            res.send(`${req.query.name} is not an agent`);
            return;
        }
        res.send(rows[0]);
        console.log(rows);
    })
    db.close();
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Listening On Port ${PORT}`))