/**
 * Created by 张宇鸿 on 2016/4/18.
 */
function initPmdsView(d){
    this.chart=document.getElementById("PmdsView");
    $(this.chart).empty();

    //svg
    var svgWidth=650;
    var svgHeight=650;
    var svg = d3.select(this.chart).append("svg")
        .attr("width",svgWidth)
        .attr("height",svgHeight);
    var instance=[];

    //for(var i=0;i< WHOLEPointData.length;i++)
    //{
    //    instance[i]=[];
    //    for(var j=0;j< WHOLEPointData.length;j++)
    //    {
    //        instance[i][j]=0;
    //        for(var k=0;k< d.length;k++)
    //        {
    //            instance[i][j] = instance[i][j]+Math.pow(WHOLEPointData[i][d[k]]-WHOLEPointData[j][d[k]],2)
    //            //instance[i][j]=Math.random();
    //        }
    //    }
    //}
    console.log("d------------------------")
    console.log(d);
    for(var i=0;i<WHOLEPointData.length; i++)
    {
        instance[i]=[];
        for(var j=0; j<i; j++)
        {
            instance[i][j]=0;
            for(var k=0;k< d.length;k++)
            {
                instance[i][j] += Math.pow(WHOLEPointData[i][d[k]]-WHOLEPointData[j][d[k]],2)
                //instance[i][j]=Math.random();
            }
            instance[i][j] = Math.sqrt(instance[i][j]);
        }
    }

    for(var i=0; i<WHOLEPointData.length; i++)
    {
        for(var j=i; j<WHOLEPointData.length; j++)
        {
            if(i == j)
            {
                instance[i][j] = 0;
            }
            else
            {
                instance[i][j] = instance[j][i];
            }
        }
    }


    var mdsData = MDS(instance,2);
    for(var index =0;index<mdsData.length;index++)
    {var p =WHOLEPointData[index];
     var k =  p[p.length-1];
        mdsData[index][2]=k;}
    addPoint(mdsData);
}
function addPoint(data){
    //console.log(data);
    var svgWidth = 650;//画布宽度
    var svgHeight= 650;//画布高度
    var pointSize = 3;//点的大小
    var padding = 3;//padding值
    var pointFirstName ="Point";
    var nameIndex=0;
    this.chart=document.getElementById("PmdsView");
    //映射函数设置
    var xRange = [d3.min(data,function(d){return d[0]}),d3.max(data,function(d){ return d[0]})];
    var yRange = [d3.min(data,function(d){return d[1]}),d3.max(data,function(d){ return d[1]})];
    //
    var mapX = d3.scale.linear()
        .domain([xRange[0],xRange[1]])
        .range([0+padding,svgWidth-padding])
        .nice();

    var mapY = d3.scale.linear()
        .domain([yRange[0],yRange[1]])
        .range([svgHeight-padding,0+padding])
        .nice();

    //绘制点

    d3.select(this.chart).select("svg").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",function(d)
        {
            return mapX(d[0]);
        })
        .attr("cy",function(d)
        {
            return mapY(d[1]);
        })
        .attr("r",pointSize)
        .attr("id",function(){
            nameIndex++;
            return pointFirstName+nameIndex;
        })
        .attr("fill",function(d)
        {
            return d[2]
        })




}