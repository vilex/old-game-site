// import XLSX form 'xlsx'
var XLSX = require('xlsx');
var fs = require('fs');


var workbook = XLSX.readFile('docs/game.xlsx',{type:'binary'});




// 编辑推荐
var bjtj = workbook.Sheets['编辑推荐'];
var bjtj_obj = {};
for(var i = 2; i < 10; i++){
    var key = bjtj['A'+i]['w'];
    bjtj_obj[key] = {};
    bjtj_obj[key].name = bjtj['B'+i]['w'];
    bjtj_obj[key].type = bjtj['C'+i]['w'];
    bjtj_obj[key].des = bjtj['D'+i]['w'];
    bjtj_obj[key].icon = bjtj['E'+i]['w'];
}

bjtj_obj = 'var bjtj = ' + JSON.stringify(bjtj_obj);
write('../config/bjtj.js',bjtj_obj);





// 写文件
function write(name,data){
    fs.writeFileSync(name,data);
}