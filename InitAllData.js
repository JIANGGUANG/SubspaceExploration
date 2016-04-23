/**
 * Created by jiangguang on 2016/4/17.
 */

//全局变量申明
var WHOLEPointData = [];    //数据点集：存储的数据类型为点数据类型 最后一个元素存储点的颜色
var WHOLEDimensionPoint = []; //维度点集:存储的数据类型为维度点数据类型 0号元素存储ID， 1，2存储坐标值，3颜色

/**
 * 读取csv文件 得到所有点对象的集合， 和维度点对象集合
 * @param csvDataName:csv文件名称
 * @constructor
 */
function InitAllData(csvDataName)
{
    loadFileTest(csvDataName);
    setTimeout(function()
    {
        getPointData();
        setTimeout(function()
        {
            getDimensionPoint();
        },100)
    },100
    )
}

/**
 * 得到所有点的对象集合
 */
function  getPointData()
{
    var point = formatData();     //点的原始数据

    var res = [];
    for(var j in point)
    {
        point[j].push(getColor(0));
        res.push(point[j]);
    }
    WHOLEPointData = res;
    console.log(res);

}
/**
 * 计算mds 得到所有维度点对象集合
 */
function getDimensionPoint()
{
    var distance = [];   //存储维度间的距离
   // console.log(WHOLEPointData);
    var dimension = WHOLEPointData[0].length -1;   //维度个数
    for(var i=0; i<dimension; i++)   //距离矩阵初始化
    {
        var temp = [];
        for(var j=0; j<dimension; j++)
        {
            temp.push(0);
        }
        distance.push(temp);
    }
    for(var i=0; i<distance.length; i++)  //先得到一半的距离阵  :: 距离要平方？？？？？？？？？？？？？？？
    {
        for(var j=0; j<i; j++)
        {
            var sim = SimilarityDimension([i, j]);  //得到相似度
            var dist = sim;    //距离
            //dist = dist*dist;    //-----------------------------------平方
            distance[i][j] = dist;
        }
    }

    for(i=0; i<distance.length; i++)    //得到另一半
    {
        for(j=i; j<distance.length; j++)
        {
            if(i==j)
            {
                distance[i][j] = 0;    //相同维度赋0
            }
            else
            {
                distance[i][j] = distance[j][i];
            }
        }
    }


   for(var i =0; i<distance.length; i++)
   {
       console.log(distance[i]);
   }


    var mdsRes =  MDS(distance, 2);    //得到MDS
  //  console.log(mdsRes);
    WHOLEDimensionPoint = [];   //维度点清空
    for(var i=0; i<mdsRes.length; i++)
    {
        WHOLEDimensionPoint.push([i, mdsRes[i][0], mdsRes[i][1], getColor(0)]);   //初始颜色为0号index
    }
}

/**
 * 将originData转换成foloat型的数组
 * @returns {Array}：结果
 */
function formatData()
{
    var res = [];
    for(var i in  originData) {
        var temp =[];
        for (var j in originData[i])
        {
            temp.push(parseFloat(originData[i][j]));
        }
        res.push(temp);
    }
    console.log(res);
    var res2 = [];
    for(var i=0; i<res[0].length; i++)
    {
        var max = d3.max(res, function (d) {
            return d[i];
        });
        var min = d3.min(res, function(d)
        {
            return d[i];
        })
        //var map = d3.scale.linear()
        //    .domain([min, max])
        //    .range([0,1]);
        var temp = [];
        for(var  j=0;j<res.length; j++)
        {
          //  console.log([i , j ,res[j][i]/(max-min)]);
            res[j][i] = res[j][i]/(max - min);
        }
    }

    return res;
}


//测试函数
function InitAllDataTest()
{
    console.log(WHOLEPointData);
    console.log(WHOLEDimensionPoint)
;
}