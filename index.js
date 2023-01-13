const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const dotenv = require("dotenv").config();
const Path = require("path");

const FormData = require("form-data");
const { createWriteStream } = require("fs");

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTENDURL,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: __dirname });
});

app.post("/get-posts", async (req, res) => {
  const { url } = req.body;
  const resp = await axios.get(url);
  // console.log(resp.data);
  const imgtest = resp.data.graphql.shortcode_media.edge_sidecar_to_children.edges[2].node.display_resources[2].src;
  console.log(imgtest);

  const form = new FormData();

  const path = Path.resolve(__dirname, "images", "code.jpg");
  const writer = createWriteStream(path);

  const imgRes = await axios.get(imgtest, {
    responseType: "stream",
  });

  imgRes.data.pipe(writer);

  form.append("img", imgRes, "img.png");

  res.send(form);

  // const imgRes = await axios.get(imgtest, {
  //   responseType: "arraybuffer"
  // });
  // const base64Img = Buffer.from(imgRes.data, "binary").toString("base64");

  // console.log(base64Img);

  // res.send(resp.data);
  // res.send({ img: base64Img });
});

const port = process.env.PORT || 3200;

app.listen(port, function () {
  console.log(`Web server listening on port ${port}`);
});
