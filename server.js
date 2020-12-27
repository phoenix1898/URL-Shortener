const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shorturl = require('./models/shortUrls')

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.zvxix.mongodb.net/<database>?retryWrites=true&w=majority',{
  useNewUrlParser:true,useUnifiedTopology:true  
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', async(req,res)=>{
    const shortUrls = await shorturl.find()
    res.render('index',{shortUrls:shortUrls})
})

app.post('/shorturl',async (req,res)=>{
    await shorturl.create({full:req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await shorturl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })


app.listen(process.env.PORT || 5000)