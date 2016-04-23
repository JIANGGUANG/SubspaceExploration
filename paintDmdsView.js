/**
 * Created by jiangguang on 2016/4/18.
 */
//全局变量声明
var LOCALSelectDIMPoint = [];     //存储被选中的维度点ID
var LOCALTransparency = [];       //存储每个点离被选中维度集的距离 [[id,distance].......

//-----------------------------------------------------------------------------------------
/**
 * 初始化DmdsView,一开始调用
 * 绘制维度点
 */
function initDmdsView()
{
    this.chart = document.getElementById("DmdsView");
    $(this.chart).empty();          //清空界面元素
    //svg set
    var svgWidth = 650;
    var svgHeight = 650;
    var svg = d3.select(this.chart).append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    addDimensionPoint();

}
//------------------------------------------------------------------------------------------
//绘制维度点
function addDimensionPoint()
{
    //svg参数
    var svgWidth = 650;
    var svgHeight = 650;
    this.chart = document.getElementById("DmdsView");
    //间隔设置
    var padding = 3;
    //维度点设置
    var pointSize = 20;
    var pointFirstName = "DIMWNSION";      //点名前缀
    //映射函数设置
    var xRange = [d3.min(WHOLEDimensionPoint, function(d){return d[1]}),  d3.max(WHOLEDimensionPoint, function(d){return d[1]})];
    var yRange = [d3.min(WHOLEDimensionPoint, function(d){return d[2]}),  d3.max(WHOLEDimensionPoint, function(d){return d[2]})];
    var mapX = d3.scale.linear()
        .domain([xRange[0] , xRange[1]])
        .range([0+padding, svgWidth-padding])
        .nice();
    var mapY = d3.scale.linear()
        .domain([yRange[0] , yRange[1]])
        .range([svgHeight-padding, 0+padding])
        .nice();

    for(var i=0; i<WHOLEDimensionPoint.length; i++)
    {
        var wx = WHOLEDimensionPoint[i][1];
        var wy = WHOLEDimensionPoint[i][2];
        var cx = mapX(wx);
        var cy = mapY(wy);
    }
    //绘制维度点
    d3.select(this.chart).select("svg").selectAll("circle")
        .data(WHOLEDimensionPoint)
        .enter()
        .append("circle")
        .attr("cx", function(d)
        {
            return mapX(d[1]);
        })
        .attr("cy", function(d)
        {
            return mapY(d[2]);
        })
        .attr("r", pointSize)
        .attr("id", function(d)
        {
            return pointFirstName+d[0];  //id格式
        })
        .attr("fill", function(d)
        {
            return d[3];
        })
        .on("click", function(d)     //点击事件
        {
            var thisPoint =  d3.select(this);
            var fillColor = thisPoint.attr("fill");
            var id = thisPoint.attr("id");
            var ID = parseInt(id.substr(pointFirstName.length));
          //  var isCheck = fillColor == "red";
            if(fillColor == "red")
            {
                thisPoint.attr("fill",function(d)
                {
                    return d[3];
                });
              delDimPoint(ID);
            }
            else
            {
                thisPoint.attr("fill",function(d)
                {
                    return "red";
                });
                addDimPoint(ID);
            }

        });
    d3.select(this.chart).select("svg").selectAll("text")
        .data(WHOLEDimensionPoint)
        .enter()
        .append("text")
        .attr("x",function(d){return mapX(d[1])-pointSize/3})
        .attr("y", function(d){return mapY(d[2])+pointSize/3})
        .text(function(d){return d[0]+1})
        .attr("stroke","yellow")
        .attr("font-size",3);

}
/**
 * 根据各个维度（除开选中维度集）与选中维度之间点距离设置各个维度的透明度
 */
function  setTransparency()
{
    this.chart = document.getElementById("DmdsView");
    var allPoint = d3.select(this.chart).select("svg").selectAll("circle");
    var pointFirstName = "DIMWNSION";      //点名前缀
    var rangeTransparency = [d3.min(LOCALTransparency, function(d){return d[1]}), d3.max(LOCALTransparency, function(d){return d[1]})];
    var mapTransparency = d3.scale.linear()
        .domain([rangeTransparency[0] , rangeTransparency[1]])
        .range([1,0.1])
        .nice();
    allPoint.each(
        function(){
            var thisPoint =  d3.select(this);
            var id = thisPoint.attr("id");
            if(pointFirstName == id.substr(0,pointFirstName.length))
            {
                var ID = parseInt(id.substr(pointFirstName.length));
                var dis = -1;
                for(var i=0; i<LOCALTransparency.length; i++)
                {
                    if(ID == LOCALTransparency[i][0])
                    {
                        dis = LOCALTransparency[i][1];   //得到距离
                    }
                }
                thisPoint.attr("opacity", mapTransparency(dis));
            }
        });
}
/**
 * 添加一个维度点到可选队列
 * @param id
 */
function addDimPoint(id)
{
    if(!isIn(id))
    {
        LOCALSelectDIMPoint.push(id);
        getDistance();
        setTransparency();
    }

}
/**
 * 从可选队列中删除一个维度点
 * @param id
 */
function delDimPoint(id)
{
    {
        var index = 0;
        for(index=0; index<LOCALSelectDIMPoint.length; index++)  //找到对应点位置
        {
            if(id == LOCALSelectDIMPoint[index])
            {
                break;
            }
        }
        LOCALSelectDIMPoint.splice(index,1);
    }
    getDistance();
    setTransparency();
}

/**
 * 将点按direction方向移动distance距离
 * @param direction:单位向量[a,b], 以屏幕左下为坐标原点
 * @param pointObj:点的对象
 * @param distance:移动距离
 * @param svgHeight:svg宽度
 * @param svgWidth：高度
 */
function movePoint(direction,pointObj,distance,svgHeight,svgWidth)
{
    var pointRx = parseFloat(pointObj.attr("cx"));  //点的当前坐标x
    var pointRy = parseFloat(pointObj.attr("cy")); //点的当前坐标y
    var pointSize = parseFloat(pointObj.attr("r")); //点的大小
    //方向归一化
    var leng = direction[0]*direction[0] +  direction[1]*direction[1];
}

//----------------------------------------------------------------------
//算法函数
//----------------------------------------------------------------------
/**
 * 得到每个点相对当前选中纬度集点距离（相似性）
 */
function getDistance()
{
    if(LOCALSelectDIMPoint.length <=0)
    {
        LOCALTransparency = [];
        for(var i=0; i<WHOLEDimensionPoint.length; i++)
        {
            LOCALTransparency.push(WHOLEDimensionPoint[i][0], 0);
        }
    }
    else
    {
        LOCALTransparency = [];
        for(var i=0; i<WHOLEDimensionPoint.length; i++)
        {
           var id = WHOLEDimensionPoint[i][0];
            if(isIn(id))
            {
                LOCALTransparency.push([id, 0]);            //被选中维度间维度为0
            }
            else
            {
                var tempPoint = [];
                for(var j=0; j<LOCALSelectDIMPoint.length; j++)  //得到LOCALSelectDIMPoint的一个副本
                {
                    tempPoint.push(LOCALSelectDIMPoint[j]);
                }
                tempPoint.push(id);                                   //将当前点放入其中
                var dis = SimilarityDimension(tempPoint);
                LOCALTransparency.push([id, dis]);
            }
        }
    }
}
/**
 * 判断id 是否在LOCALSelectDIMPoint内
 * @param id
 * @param data
 * @returns {boolean}
 */
function isIn(id)
{
    var data = LOCALSelectDIMPoint;
    var ret = false;
    for(var i=0; i<data.length; i++)
    {
        if(id == data[i])
        {
            ret = true;
            break;
        }
    }
    return ret;
}