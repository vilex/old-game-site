// import XLSX form 'xlsx'
var XLSX = require('xlsx');
var fs = require('fs');


var workbook = XLSX.readFile('../docs/game.xlsx',{type:'binary'});




// 编辑推荐
output('编辑推荐',10,'bjtj');

// 更多小游戏
output('更多小游戏',17,'gdxyx');

// 最新小游戏合集
output('最新小游戏合集',13,'zxxyxhj');

// 找游戏
output('最新小游戏合集',13,'zyx');

// 找游戏
output('找茬系列',4,'zhaochaxilie');

// 全部编辑推荐
output('全部编辑推荐',12,'quanbubianjituijian');

// 输出表
function output(sheetName,len,oname){
    var sheet = workbook.Sheets[sheetName];
    var sheet_obj = {};
    for(var i = 2; i < len; i++){
        var key = sheet['A'+i]['w'];
        sheet_obj[key] = {
            'name' : sheet["B"+i]['w'],
            'type' : sheet["C"+i]['w'],
            'des'  : sheet["D"+i]['w'],
            'icon' : sheet["E"+i]['w']
        }
    }
    sheet_obj = 'var '+ oname +' = ' + JSON.stringify(sheet_obj);
    write('../../config/'+oname+'.js' , sheet_obj);
}

// 写文件
function write(name,data){
    fs.writeFileSync(name,data);
    console.log('output == > ' , name );
}