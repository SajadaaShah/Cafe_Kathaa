const express = require("express");
const app= express();
const path = require('path');
const placeOrderPath = path.join(__dirname, 'views', 'placeorder.hbs');
const port = 3003;
//const mysql=require("./connection").con
const bodyParser = require('body-parser');
const session = require('express-session');


const mysql = require('mysql');
const con = mysql.createConnection({
   host: "localhost",
     user: "root",
     password: "",
     database: "kathaa",
   port:3308
 });


 con.connect((err) => {
    if(err) throw err;
    else
        console.log("connection created");
});

module.exports.con=con;

//configuration 
    app.set("view engine", "hbs");
    app.set("views", "./view")
    app.use(express.static (__dirname + "/public" ));

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
}));



//routing
app.get("/",(req, res) => {     //index
    res.render("index")
});

app.get("/index1",(req, res) => {     //index
    res.render("index1")
});


app.get("/admin",(req, res) => {     //admin login
    res.render("admin")
});

app.post('/validation', (req, res) => {
    const { username, password } = req.body;

    // Perform validation here
    if (username === 'admin' && password === 'admin123') {
        req.session.isLoggedIn = true;
        res.redirect('/main');
    } else {
        res.send('Invalid username or password');
    }
});


app.get("/main",(req, res) => {  
    res.render("main")           //admin main page
});


app.get("/order",(req, res) => {   //order

    res.render("order")
 
});


app.get("/displayorder",(req, res) => {   // add order
    res.render("displayorder")
});


//changes
app.get("/books",(req, res) => {
    res.render("books")
});

app.get("/food",(req, res) => {
    res.render("food")
});

app.get("/addbook",(req, res) => {   
    res.render("addbook")
});
app.get("/searchbook",(req, res) => {   
    res.render("searchbook")
});
app.get("/updatebook",(req, res) => {   
    res.render("updatebook")
});
app.get("/deletebook",(req, res) => {   
    res.render("deletebook")
});


// BOOK

app.get("/addfood",(req, res) => {   // add order
    res.render("addfood")
});
app.get("/searchfood",(req, res) => {   // add order
    res.render("searchfood")
});
app.get("/updatefood",(req, res) => {   // add order
    res.render("updatefood")
});
app.get("/deletefood",(req, res) => {   // add order
    res.render("deletefood")
});
// app.get("/displayfood",(req, res) => {   // add order
//     res.render("displayfood")
// });



app.get("/staff",(req, res) => {
    res.render("staff")
});
app.get("/addstaff",(req, res) => {   // add order
    res.render("addstaff")
});
app.get("/searchstaff",(req, res) => {   // add order
    res.render("searchstaff")
});
app.get("/updatestaff",(req, res) => {   // add order
    res.render("updatestaff")
});
app.get("/deletestaff",(req, res) => {   // add order
    res.render("deletestaff")
});

// ORDER

app.get("/placeorder", (req, res) => {
    res.render("placeorder");
  });
  

app.get("/addbookdata",(req, res) => {   
    //fetching data  
   //res.send(req.query);

  const {ISBNno, title, price, author,edition} = req.query;


   let qry="select * from book where ISBNno=?";

   con.query(qry, [ISBNno], (err, results) => {
    
    if(err) throw err
    else{
        if(results.length >0){
            res.render("addbook",{checkmesg:true});
        }
        else{
            let qry2= "insert into book values(?,?,?,?,?)";
            con.query(qry2,[ISBNno, title, price, author,edition], (err,results) =>{
               // res.send(results);
               if(results.affectedRows>0){
                res.render("addbook",{mesg:true});
               }
            })
        }
    }
   } )
});



app.get("/searchbookdata",(req,res) =>{
  
    const { ISBNno } = req.query;
    let qry = "select * from book where ISBNno=?";
    con.query(qry,[ISBNno], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.length > 0){
                res.render("searchbook",{mesg1: true, mesg2: false})
            }else{
                res.render("searchbook",{mesg1: false, mesg2: true})
            }
        }
    });
})




app.get("/deletebookdata", (req,res) =>{

    //fetch

    const { ISBNno } = req.query;
    let qry = "delete from book where ISBNno=?";
    con.query(qry,[ISBNno], (err, results) => {
        if(err) {
            throw err
        }
        else{
            if(results.affectedRows > 0){
                res.render("deletebook",{mesg1: true, mesg2: false})
            }else{
                res.render("deletebook",{mesg1: false, mesg2: true})
            }
        }
    }); 

})


app.get("/updatesearch", (req,res) =>{
 
    const { ISBNno } = req.query;
    let qry = "select * from book where ISBNno=?";
    con.query(qry,[ISBNno], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.length > 0){
                res.render("updatebook",{mesg1: true, mesg2: false,  data: results })
            }else{
                res.render("updatebook",{mesg1: false, mesg2: true})
            }
        }
    });
})

    
app.get("/updatebookdata", (req,res) =>{
 
    const { ISBNno, price, edition } = req.query;
    let qry = "update book set price=?, edition=? where ISBNno=?";
    con.query(qry,[price, edition, ISBNno], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.affectedRows > 0){
                res.render("updatebook",{ umesg: true})
            
            }
        }
  
    });
})



app.get("/displaybook",(req, res) => {   
    let qry="select * from book";

    con.query(qry ,(err,results)=>{
            if(err) throw err
            else{
                res.render("displaybook",{data:results});
            }
    });
})


app.get("/displaystaff",(req, res) => {   
    let qry="select * from staff";

    con.query(qry ,(err,results)=>{
            if(err) throw err
            else{
                res.render("displaystaff",{data:results});
            }
    });
})


app.get("/displayfood",(req, res) => {   
    let qry="select * from food";

    con.query(qry ,(err,results)=>{
            if(err) throw err
            else{
                res.render("displayfood",{data:results});
            }
    });
})


//FOOD 


app.get("/addfooddata",(req, res) => {   
    //fetching data  
   //res.send(req.query);

  const {foodname, category, amount } = req.query;


   let qry="select * from food where foodname=?";

   con.query(qry, [foodname], (err, results) => {
    
    if(err) throw err
    else{
        if(results.length >0){
            res.render("addfood",{checkmesg:true});
        }
        else{
            let qry2= "insert into food values(?,?,?)";
            con.query(qry2,[foodname, category, amount], (err,results) =>{
               // res.send(results);
               if(results.affectedRows>0){
                res.render("addfood",{mesg:true});
               }
            })
        }
    }
   });
})

app.get("/searchfooddata",(req,res) =>{
  
    const { foodname } = req.query;
    let qry = "select * from food where foodname=?";
    con.query(qry,[foodname], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.length > 0){
                res.render("searchfood",{mesg1: true, mesg2: false})
            }else{
                res.render("searchfood",{mesg1: false, mesg2: true})
            }
        }
    });
})



app.get("/deletefooddata", (req,res) =>{

    //fetch

    const { foodname } = req.query;
    let qry = "delete from food where foodname=?";
    con.query(qry,[foodname], (err, results) => {
        if(err) {
            throw err
        }
        else{
            if(results.affectedRows > 0){
                res.render("deletefood",{mesg1: true, mesg2: false})
            }else{
                res.render("deletefood",{mesg1: false, mesg2: true})
            }
        }
    }); 

})



  
app.get("/updatesearchfood", (req,res) =>{
 
    const { foodname } = req.query;
    let qry = "select * from food where foodname =?";
    con.query(qry,[foodname], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.length > 0){
                res.render("updatefood",{mesg1: true, mesg2: false,  data: results })
            }else{
                res.render("updatefood",{mesg1: false, mesg2: true})
            }
        }
    });
})

    
app.get("/updatefooddata", (req,res) =>{
 
    const { foodname,amount } = req.query;
    let qry = "update food set amount=? where foodname=?";
    con.query(qry,[amount,foodname], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.affectedRows > 0){
                res.render("updatefood",{ umesg: true})
            
            }
        }
  
    });
})


//STAFF
app.get("/addstaffdata",(req, res) => {   
    //fetching data  
   //res.send(req.query);

  const {staffID, name, birthdate, designation,gender, phone } = req.query;


   let qry="select * from staff where staffID=?";

   con.query(qry, [staffID], (err, results) => {
    
    if(err) throw err
    else{
        if(results.length >0){
            res.render("addstaff",{checkmesg:true});
        }
        else{
            let qry2= "insert into staff values(?,?,?,?,?,?)";
            con.query(qry2,[staffID, name, birthdate, designation,gender, phone], (err,results) =>{
               // res.send(results);
               if(results.affectedRows>0){
                res.render("addstaff",{mesg:true});
               }
            })
        }
    }
   });
})

app.get("/searchstaffdata",(req,res) =>{
  
    const { staffID } = req.query;
    let qry = "select * from staff where staffID=?";
    con.query(qry,[staffID], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.length > 0){
                res.render("searchstaff",{mesg1: true, mesg2: false})
            }else{
                res.render("searchstaff",{mesg1: false, mesg2: true})
            }
        }
    });
})
app.get("/deletestaffdata", (req,res) =>{

    //fetch

    const { staffID } = req.query;
    let qry = "delete from staff where staffID=?";
    con.query(qry,[staffID], (err, results) => {
        if(err) {
            throw err
        }
        else{
            if(results.affectedRows > 0){
                res.render("deletestaff",{mesg1: true, mesg2: false})
            }else{
                res.render("deletestaff",{mesg1: false, mesg2: true})
            }
        }
    }); 

})

app.get("/updatesearchstaff", (req,res) =>{
 
    const { staffID } = req.query;
    let qry = "select * from staff where staffID =?";
    con.query(qry,[staffID ], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.length > 0){
                res.render("updatestaff",{mesg1: true, mesg2: false,  data: results })
            }else{
                res.render("updatestaff",{mesg1: false, mesg2: true})
            }
        }
    });
})

    
app.get("/updatestaffdata", (req,res) =>{
 
    const { designation, staffID, phone } = req.query;
    let qry = "update staff set designation=?, phone=? where staffID=?";
    con.query(qry,[designation, phone, staffID], (err,results)=>{
        if(err) {
            throw err
        }
        else{
            if(results.affectedRows > 0){
                res.render("updatestaff",{ umesg: true})
            
            }
        }
  
    });
})



// Add order

app.get("/addorderdata",(req, res) => {   // add order
    const { username, foodname, title, price,emailID} = req.query;
    
    let qry="select * from orders where username=?";

    con.query(qry, [username], (err, results) => {
    
     if(err) throw err
     else{
         if(results.length >0){
             res.render("placeorder",{checkmesg:true});
         }
         else{
             let qry2= "insert into orders values(?,?,?,?,?)";
             con.query(qry2,[username, foodname, title, price,emailID], (err,results) =>{
                // res.send(results);
                if(results.affectedRows>0){
                 res.render("placeorder",{mesg:true});
                
                }
             })
         }
     }
    } )
 });

 


//create server
app.listen(port, (err) => {
    if(err)
        throw err;
    else
        console.log("Server i srunning at port %d: ", port);
});