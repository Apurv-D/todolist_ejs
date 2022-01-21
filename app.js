const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemsSchema ={
    name : String
};

const Item = mongoose.model("Item", itemsSchema);

const newItem = new Item({
    name : "Welcome to your todo list!"
});
const newItem2 = new Item({
    name : "Use ➕ to add items in you Active list."
});
const newItem3 = new Item({
    name : "<- Tick this box on completion of the task."
});

const defaultItems = [newItem, newItem2, newItem3];

const listSchema = {
    name : String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)


// home route 

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                } else{
                    console.log("Successfully saved the default items in DB");
                }
            });

            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListTasks:foundItems});
        }
    });    
});


app.get("/:customListName", function(req, res){
    const customListName =  _.capitalize(req.params.customListName);

    List.findOne({name:customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });
            
                list.save();
                res.redirect("/" + customListName); 
            } else {
                res.render("list",{listTitle: foundList.name, newListTasks:foundList.items})
            }
        }
    });
});




app.post("/", function(req, res){

    const taskName = req.body.newTask;
    const listName = req.body.btn;
    
    const addItem = new Item({
        name : taskName
    });

    if(listName ==="Today"){
        addItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(addItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    

});


app.post("/delete", function(req,res){
    const checkedItemId =  req.body.checkbox;
    const listName = req.body.listName;

    if(listName ==="Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){
                console.log("SUccessfully deleted the checked task.");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name : listName},{$pull : {items: {_id : checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/".listName);
            }
        });
    }
    
    
});


// listening to post 3000 


app.listen(3000, function(){
    console.log("Server started on port 3000");
});

