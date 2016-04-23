var originData = [];  //原始数据

//var dataName = './iris.csv';
//loadFileTest(dataName);

var loadFileTest = function(dataName)
{
    originData = [];
    d3.csv(dataName,function(error,data){
        originData = data;
    })
}


