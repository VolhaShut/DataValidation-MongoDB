const fs = require("fs");
const xlsx = require("node-xlsx");

function csvParse(type, filePath) {
    let data = [];
    let company = {};
    return new Promise(function (resolve) {
        let rl = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
        rl.on('line', (line) => {
            company.symbols = line;
        });
        rl.on('error', (err) => {
            console.log(err);
        });
        rl.on('close', () => {
            data.push(company);
            resolve({"type": type, "data": data});
        });

    });
}

function xlsxToCsv(filePath) {
    let allSheet = {
        'sheetName':'',
        'head':[],
        'data':[]
    };
    let sheets = [];
    xlsx.parse(fs.readFileSync(filePath)).map((sheet) => {
        allSheet.sheetName = sheet.name;
        sheet.data.map((line) => {
            if (line.length == 1) {
                allSheet.head.push(line.toString());
            } else if (line.length > 1) {
                allSheet.data.push(line.join('|'));
            }
        });
        sheets.push(allSheet);
    });
    return sheets;
}

function readFilesFromDir(dirPath) {
    let tempName;
    let currentArray=[];
    let reg=/ - \w.* - /g;
    let filesInDir=fs.readdirSync(dirPath);
    if (filesInDir.length>0){
        filesInDir.map((file)=>{
            if (file.includes('Clarion')){
                tempName=file.match(reg);
                tempName=tempName[0].replace(/ - /g,'');
                reg.lastIndex = 0;
                return currentArray.push({
                    'name':tempName,
                    'data':xlsxToCsv(dirPath+'\\'+file)
                });
            }
        })
    }
    return currentArray;
}

module.exports = {
    csvParse,
    xlsxToCsv,
    readFilesFromDir
};
