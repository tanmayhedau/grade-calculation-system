const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/route");
mongoose.set("strictQuery", true);

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://tannmayhedau619:Tanmay%40619@cluster0.fw1xhuw.mongodb.net/grade-calculation-system",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Mongodb is connected"))
  .catch((error) => console.log(`${error}`));

app.use("/", route);

app.listen(3000, () => {
  console.log("Express app is running on port 3000");
});
 