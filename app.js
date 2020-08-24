const express = require('express');

app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.json());
app.listen(port, function () {
    console.log(`server running on port: ${port}`);
});