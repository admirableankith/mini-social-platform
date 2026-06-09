require("dotenv").config();
const express=require("express");

const path=require("path");
const app=express();
const userModel=require("./models/user");
const postModel=require("./models/post");
const cookieParser=require("cookie-parser");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const upload=require("./config/multerconfig");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
 

app.get("/profile/upload",(req,res)=>{
    res.render("profileupload");
})

// console.log(upload);
// console.log(upload.single);

app.post("/upload",isLoggedIn,upload.single("image"),async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
    user.profilepic=req.file.filename;
    await user.save();
    res.redirect("/profile");
})

app.get("/login",(req,res)=>{
    // console.log(req.cookies.token);
    res.render("login"); 
});



app.get("/",(req,res)=>{
    // console.log(req.cookies.token);
    res.render("index.ejs"); 
});


app.get("/profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile", { user }); 
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id);

    if (!post) return res.send("Post not found");

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id);

    res.render("edit", { post });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id },{content:req.body.content});

   res.redirect("/profile") ;
});


app.get("/delete/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id);
    if (!post) return res.send("Post not found");
    await userModel.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { posts: req.params.id } }
    );
    await postModel.findByIdAndDelete(req.params.id);
    res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let {content}=req.body;
    let post=await postModel.create({
        user:user._id,
        content:content
    });
   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile");
});

app.post("/register" ,async(req,res)=>{
   let {email,password,username,name,age}=req.body;

   let user=await userModel.findOne({email});
if(user) return res.redirect("/login");
   bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async(err,hash)=>{
       let createdUser=await userModel.create({
            username,
            email,
            age,
            name,
            password:hash
        });
          let token = jwt.sign({ email: email, userid: createdUser._id }, process.env.JWT_SECRET);           
          res.redirect("/profile");
    })
   })
}); 


app.post("/login" ,async(req,res)=>{
   let {email,password}=req.body;

   let user=await userModel.findOne({email});
   if(!user) return res.status(500).send("smtg went wrong!!");

   bcrypt.compare(password,user.password,function(err,result){
  if(result){
   let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);    res.cookie("token",token);
    res.status(200).redirect("/profile");
   }
   else res.redirect("/login");

});
});



app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/login"); 
});

function isLoggedIn(req, res, next) {
    if (!req.cookies.token || req.cookies.token === "") return res.redirect("/login");
    let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = data;
    next();
}




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});