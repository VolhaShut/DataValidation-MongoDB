const MongoClient = require('mongodb').MongoClient,
        test = require('assert'),
        fs=require('fs'),
    tickers=require('./../input/tickers.json').tickers;

function getDataFromMongo(userName,password,host,baseName) {
    let database;
    let cursor;
    return MongoClient.connect('mongodb://'+userName+':'+password+'@'+host+'/'+baseName)
        .then((db)=>{
            database=db;
            console.log('Mongo Conn....');
            return database.collection('CompanyInfo');
        }).then((companies)=> {
            return companies.find({"symbols.Ticker":{ $in: tickers}}).toArray();
        }).then((elements)=>{
            return fs.writeFileSync('./output/companiesG24.json',JSON.stringify(elements),'utf8');
        }).then(()=>{
            database.close();
        }).catch((err)=>{
            database.close();
            console.log(err);
        });
}

module.exports={
    getDataFromMongo
};

