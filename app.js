const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
app.use(bodyParser.urlencoded({extended:true}));


customers_id = []
purchase_id = []

mongoose.connect('mongodb://localhost:27017/backendassignment',{useNewUrlParser:true});
//api 1(customers)
const customerSchema = new mongoose.Schema({
  customerName:String,
  email:String,
  number:Number,
  customer_id:String
});
const Customer = mongoose.model("Customer",customerSchema);
app.get("/customers",(req,res) =>
{
  Customer.find(function(err,foundcustomers){
    if(!err)
    {
      res.send('found customer'+foundcustomers);
    }
    else
    {
      res.send(err);
    }
  });
});
app.post("/customers",(req,res) => {
  const cname = req.body.cname;
  const email = req.body.email;
  const number = req.body.number;
  const c_id = ID();
  customers_id.push(c_id);
  const newCustomer = new Customer({
    customerName:cname,
    email:email,
    number:number,
    customer_id:c_id
    });
    newCustomer.save(function(err)
  {
    if(!err){
      res.send("Succesfully added customer details.");
    }
    else{
      res.send(err);
    }
  });
})
//api 2
const purchaseSchema = new mongoose.Schema({
  productName:String,
  Quantity:Number,
  Pricing:Number,
  Mrp:Number,
  purchase_order_id:String,
  customer_id:String
});
const Purchase = mongoose.model("Purchase",purchaseSchema);
app.get("/purchases",(req,res) =>
{
  Purchase.find(function(err,foundpurchase){
    if(!err)
    {
      res.send('found purchase'+foundpurchase);
    }
    else
    {
      res.send(err);
    }
  });
});
app.post("/purchases",(req,res) => {
  const productName = req.body.pname;
  const quantity = req.body.quantity;
  const pricing = req.body.pricing;
  const mrp = req.body.mrp;
  const purchase = ID();
  purchase_id.push(purchase);
  const c_id =  customers_id[0];
  const newPurchase = new Purchase({
    productName:productName,
    Quantity:quantity,
    Pricing:pricing,
    Mrp:mrp,
    purchase_order_id:purchase,
    customer_id:c_id
    });
    newPurchase.save(function(err)
  {
    if(!err){
      res.send("Succesfully added product details.");
    }
    else{
      res.send(err);
    }
  });
})

//api 3

const shippingSchema = new mongoose.Schema({
  Address:String,
  City:String,
  Pincode:Number,
  purchase_order_id:String,
  customer_id:String
});

const Shipping = mongoose.model("Shipping",shippingSchema);

app.get("/shipping",(req,res) =>
{
  Shipping.find(function(err,foundshipping){
    if(!err)
    {
      res.send('found shipping'+foundshipping);
    }
    else
    {
      res.send(err);
    }
  });
});


app.post("/shipping",(req,res) => {
  const address = req.body.address;
  const city = req.body.city;
  const pincode = req.body.pincode;
  const newShipping = new Shipping({
    Address:address,
    City:city,
    Pincode:pincode,
    purchase_order_id:purchase_id[0],
    customer_id:customers_id[0]
    });
    newShipping.save(function(err)
  {
    if(!err){
      res.send("Succesfully added shipment details.");
    }
    else{
      res.send(err);
    }
  });
})

//api 4
app.get("/shipping/:token",(req,res) => {
  Shipping.findOne({City:req.params.token},function(err,foundShipment)
    {
      if(!err){
        if(foundShipment){
          res.send(foundShipment);
        }
        else{
          res.send("No articles matching that title");
        }
      }
    });
});

//api 5

app.get("/purchaseddetails",(req,res) => {
  {
    const combined_det = new mongoose.Schema(
      {
        customer_details:customerSchema,
        purchase_details:purchaseSchema
      }
    )
    const Combined =  mongoose.model("Combined",combined_det);

 

};











app.listen(3000,() => {
  console.log("Server with port 3000 is up and running");
});
