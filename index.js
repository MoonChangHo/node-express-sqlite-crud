var express = require('express');
var app = express();

//let comments=[];
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'database.sqlite'
});

const Lists = sequelize.define('Lists', {
  // Model attributes are defined here
  list: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
(async()=>{
    await Lists.sync();
    console.log("The table for the Lists model was just (re)created!");
})();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/',async function(req, res) {
  //res.render('index',{ num:3 });
  //read
  const jane=await Lists.findAll();
  res.render('index',{Lists:jane})
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/create',async function(req, res) {
    console.log(req.query)
    console.log(req.body)

    const { content }=req.body          //append와 같음

    await Lists.create({list:content})
    res.redirect('/');
});

app.post('/update/:id',async function(req, res) {
    console.log(req.params)
    console.log(req.body)

    const { content }=req.body
    const { id }=req.params

    await Lists.update({list:content},{
        where:{
            id:id
        }
    });
    
    res.redirect('/')
});

app.post('/delete/:id',async function(req, res) {
    console.log(req.params)
    console.log(req.body)

    const { content }=req.body
    const { id }=req.params

    await Lists.destroy({
        where: {
          id: id
        }
      });
    
    res.redirect('/')
});

app.listen(8080);
console.log('Server is listening on port 8080');