const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

app.set('view engine', 'ejs');

const tasks = ["Buy food", "Cook food", "Eat food"];
const workTasks = []; 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// home route 

app.get("/", function(req, res){

    let day = date.getDate();
    // here list is the ejs page 
    res.render("list", {listTitle: day, newListTasks:tasks});
});

app.post("/", function(req, res){
    let task = req.body.newTask;
    if(req.body.btn==="Work Tasks")
    {
        workTasks.push(task);
        res.redirect("/work");
    } else{
        tasks.push(task);
        res.redirect("/");
    }
    
});


// work route


app.get("/work",function(req, res){
    res.render("list",{listTitle: "Work Tasks", newListTasks:workTasks});
});

app.post("/work", function(req,res){
    let task = req.body.newTask;
    
})


// listening to post 3000 


app.listen(3000, function(){
    console.log("Server started on port 3000");
});

