const express=require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const ejs= require("ejs")
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({
    title: String,
    content:String
});
const Article = mongoose.model("article", articleSchema);
const article = new Article({
    title:"REST",
    content:"rest is a architectural design for apis "
})
// article.save();

app.route("/articles")
.get((req,res)=>{
    Article.find({},(err, articles)=>{
        if(!err){
            // console.log(articles)
            res.send(articles);
        }else{
            res.send(err)
        }
    });
})
.post((req,res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err)=>{
        if (!err){
            res.send("new article added successfully");
        }else{
            res.send(err);
        };
    });

})
.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if (!err){
            res.send("all Articles deleted successfully");
        }else{
            res.send(err);
        }
    });
});
app.route("/articles/:articleTitle")
.get((req,res)=>{
Article.findOne({title:req.params.articleTitle},(err, foundArticle)=>{
    if(foundArticle){
        res.send(foundArticle);
    }else{
        res.send("no articles found");
    }
});
})
.put((req,res)=>{
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        (err, results)=>{
        // console.log(req.params.articleTitle);
        if (!err){
            res.send("successfully updated the selected article")
        }
    });
})
.patch((req,res)=>{
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {$set:req.body},
        (err, results) => {
        if (!err){
            res.send("successfully updated article");
        }else{
            res.send(err)
        }
    });
})
.delete((req, res) => {
    console.log("hello world");
Article.deleteOne(
    {title:req.params.articleTitle},
    (err, result)=>{
        if (!err) {
            res.send("successfully deleted article");
        }else{
            res.send(err);
        }
    }
    );
});


app.listen(3000, ()=>{
    console.log("server is listening on port 3000");
});