/**
 * Created by jiangguang on 2016/4/17.
 */
//全局变量声明
var WHOLEK;           //求局部密度时k邻域


/**
 * 得到维度集合dimensionData，中维度间的相似度
 * @param dimensionData:维度的集合
 * @returns {number}:相似度
 * @constructor
 */
function SimilarityDimension(dimensionData)
{
    var res = 0;
    var h = [];  //保存维度上点的局部密度
    for(var i in dimensionData)  //得到各个维度上的每个点的局部密度
    {
        var temp = [];
        temp = H(dimensionData[i]);
        h.push(temp);
    }
    //console.log(h);
    var similary = 0;
    for(var i in h[0])   //得到维度间的相似度   sigma（min(h[i],h[i+1], .....)）
    {
        similary = similary + d3.min(h, function (d) {
                return d[i];
            })
    }
    res = similary / (WHOLEPointData.length*WHOLEPointData.length);   //similary |DB|////
    res = res-1;
    res = Math.exp(-(res));
    res=parseFloat(res)
    //console.log([dimensionData,res]);
    return res;
}
/**
 *得到指定维度上所有点的局部密度  h(p,d)
 * @param dimension:维度
 * @returns {Array}:每个点的局部密度值
 * @constructor
 */
function H(dimension)
{
    WHOLEK = 9;
    var res =[];
    var point = [];  //保存点集
    var dim = parseInt(dimension);
    for(var i in WHOLEPointData)
    {
        point.push([WHOLEPointData[i][dim],  parseInt(i)]);  //点的坐标 和 索引值
    }
    point.sort(function(a,b) {return a[0] - b[0]});  //将点按坐标进行排序
    //console.log(point);
    for(var i in WHOLEPointData)  //初始化res
    {
        res.push(0);
    }

    for(var i=0; i<point.length; i++)
    {
        var index = point[i][1];   //点的ID
        var j1=i,j2=i+1;
        var count =0;
        var  X = point[i][0] ;//当前点坐标
        while(count<WHOLEK)
        {
            if(j1>=0 && j2<point.length)
            {
                var flag = (point[j2][0]-X)>=(X-point[j1][0]);
                if(flag)
                {
                    j2++;
                }
                else
                {
                    j1--;
                }
                count++;
            }
            else if(j1<0 && j2<point.length)
            {
                j2++;
                count++;
            }
            else if(j1>=0 && j2>=point.length)
            {
                j1--;
                count++;
            }
            else
            {
                break;
            }
        }
       // res[point[i][1]] = (WHOLEK/(point[(j2-1)][0] - point[(j1+1)][0]));  //保存距离
       res[point[i][1]] = WHOLEK/((point[(j2-1)][0] - point[(j1+1)][0]));  //保存距离
    }

   // console.log(res);
    return res;
}