var express = require("express");
var bodyParser = require("body-parser");
const {ObjectID} = require('mongodb');
var cors = require("cors");
var path = require("path");

var { mongoose } = require("./db/mongoose");
var { Destination } = require("./models/destination");
var { MarkerRoutes } = require("./models/markerRoutes");


var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "/../public")));
app.use(express.static(path.join(__dirname, "/../src")));

const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

app.post("/destination", (req, res) => {
  var destination = new Destination({
    name: req.body.name,
    lat: req.body.lat,
    lon: req.body.lon,
    image: req.body.image
  });

  destination.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/alldestinations", (req, res) => {
  Destination.find().then(
    destinations => {
      res.send({ destinations });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/destination/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Destination.findById(id)
    .then(des => {
      if (!des) {
        return res.status(404).send();
      }

      res.send({ des });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.get("/destinationbyname/:name", (req, res) => {
  var name = req.params.name;

  Destination.findOne({ name: name })
    .then(des => {
      if (!des) {
        return res.status(404).send();
      }

      res.send({ des });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete("/destination/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Destination.findById(id)
    .then(des => {
      if (!des) {
        return res.status(404).send();
      }

      des.remove();
      res.send(des.name + " was removed by ID");
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete("/destinationbyname/:name", (req, res) => {
  var name = req.params.name;

  Destination.findOne({ name: name })
    .then(des => {
      if (!des) {
        return res.status(404).send();
      }
      des.remove();
      res.send(name + " was removed by name!");
    })
    .catch(e => {
      res.status(400).send();
    });
});
//MarkerRoutes
app.post("/markerRoutes", (req, res) => {
  var markerRoutes = new MarkerRoutes({
    name: req.body.name,
    routes: req.body.routes,
    image: req.body.image
  });

  markerRoutes.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});
app.get("/allroutes", (req, res) => {
  MarkerRoutes.find().then(
    routes => {
      res.send({ routes });
    },
    e => {
      res.status(400).send(e);
    }
  );
});
app.delete("/markerRoutes/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  MarkerRoutes.findById(id)
    .then(des => {
      if (!des) {
        return res.status(404).send();
      }

      des.remove();
      res.send(des.name + " was removed by ID");
    })
    .catch(e => {
      res.status(400).send();
    });
});



app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
