const http = require("http");
const { appendFile, readFileSync, stat } = require("fs");
const { join } = require("path");

const host = "localhost";
const port = 8000;
const millis = Date.now();
const date = new Date(millis).toUTCString();
const path = join(__dirname, "requests.txt");

const requestListener = function (req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  const url = req.headers.referer;
  const data =
    "This URL: " + url + " has made a request" + "At: " + date + "\n";
  console.log(data);
  readAndWrite(data);
  res.end(date);
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

async function readAndWrite(data) {
  try {
    stat(path, (err, _) => {
      if (err == null) {
        const requests = readFileSync(path).toString();
        appendToFile("requests.txt", requests + data);
      } else if (err.code === "ENOENT") {
        appendToFile("requests.txt", data);
      } else {
        console.log("Some other error: ", err.code);
      }
    });
  } catch (error) {
    console.log(`Error occurred ${error.message}`);
  }
}

async function appendToFile(fileName, data) {
  try {
    await appendFile(fileName, data, { flag: "w" }, (err) => {
      if (err) throw Error(err.message);
    });
    console.log(`Appended data to ${path}`);
  } catch (error) {
    console.error(`Got an error trying to append the file: ${error}`);
  }
}
