const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const app = express();
const port = 3000;

// express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// setting up static files
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});