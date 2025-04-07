const { time } = require('console');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())
mongoose.connect('mongodb://localhost:27017/users')
.then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log(err);
})
const productschema =  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        require:true,
        min:1
    }
    
},{timestamps:true})
const productmodel = mongoose.model('product',productschema)

app.get('/product',(req,res)=>{
    productmodel.find().then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send(err)
    })
})
app.get('/product/:id',(req,res)=>{
    productmodel.findOne({_id:req.params.id}).then((data)=>{
        res.send({product:data,massage:"product found"})
    })


})
app.post('/product',(req,res)=>{
    productmodel.create(req.body).then((data)=>{
        res.send({update:data,massage:"product created"})
    })
    .catch((err)=>{
        console.log(err)
        res.send("some problem")
    })
})
app.delete('/product/:id',(req,res)=>{
    productmodel.deleteOne({_id:req.params.id}).then((info)=>{
        res.send({product:info,message:"product deleted"})
        
    }).catch((err)=>{
        console.log(err)
        res.send({massage:"some problem"})
    })

    
})
app.put('/product/:id', (req, res) => {
    productmodel.updateOne({ _id: req.params.id }, { $set: req.body })
        .then((data) => {
            res.send({ product: data, message: "Product updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: "Some problem occurred" });
        });
});



app.listen(7000,()=>{
    console.log("server running on port 7000 http://localhost:7000");

})
