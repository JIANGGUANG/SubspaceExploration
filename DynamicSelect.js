/**
 * Created by jiangguang on 2016/4/16.
 */

/**
 * 动态选择记录器类
 *
 * @returns {Array}  返回一个新的动态选择记录器
 */
function getADynamicSelect()
{
    var mDynamicSelectDataInfo = new Object() ;     //动态记录选择的过程信息 1:选中的维度点集 2：路径信息 3：保存历史记录
    mDynamicSelectDataInfo.DimensionPoint = [];     //选中的维度点集
    mDynamicSelectDataInfo.PathInfo = [];     //路径信息 [i,j]   i 起始，j 结束
    mDynamicSelectDataInfo.HistaryInfo = [];     //保存历史记录[i,j] i 维度信息，j 路径信息

    return mDynamicSelectDataInfo;
}

/**
 * 添加新的维度点至动态选择记录器
 * @param DynamicSelect:动态选择记录器
 * @param pointInfo:新的维度点信息
 */
function addToDynamicSelect(DynamicSelect, pointInfo)
{
    var pointData = DynamicSelect.DimensionPoint;        //维度点集
    var pathData = DynamicSelect.PathInfo;         //路径集合
    var historyRecord = DynamicSelect.HistaryInfo;    //历史记录

    var i=0;
    for(i=0; i<pointData.length; i++)  //判断当前加得点是否为重复点
    {
        if(pointData[i].ID == pointInfo.ID)
        {
            i= i-1;  //当是最后一个元素时，可以通过i == pointData.length-1 来判断是否有重复点
            break;
        }
    }
    if(i>=pointData.length-1)
    {
        //首先将原始信息放入历史记录中
        var historyPointData = [];
        var histaryPathData = [];
        for(var j in pointData)
        {
            historyPointData.push(copyPoint(pointData[i]));
        }
        for(var j in pathData)
        {
            histaryPathData.push([pathData[j][0], pathData[j][1]])
        }
        historyRecord.push([historyPointData , histaryPathData]);    //历史记录

        //更新操作
        pointData.push(copyPoint(pointInfo));

        pathData = [];
        pathData = getDimensionPointPath(pointData);   //重新得到路径信息

        DynamicSelect.DimensionPoint = pointData;        //维度点集
        DynamicSelect.PathInfo = pathData;         //路径集合
        DynamicSelect.HistaryInfo = historyRecord;    //历史记录
    }
}
/**
 * 删除动态选择器中的某个维度点
 * @param DynamicSelect
 * @param pointInfo
 */
function delDynamicSelect(DynamicSelect, pointInfo)
{
    var pointData = DynamicSelect.DimensionPoint;        //维度点集
    var pathData = DynamicSelect.PathInfo;         //路径集合
    var historyRecord = DynamicSelect.HistaryInfo;    //历史记录

    var i= 0, index =0;
    for(i=0; i<pointData.length; i++)
    {
        if(pointData[i].ID == pointInfo.ID)
        {
           index = i;
            i = i-1;//当是最后一个元素时，可以通过i == pointData.length-1 来判断是否有重复点
            break;
        }
    }

    if(i>=pointData.length-1)
    {
        //首先将原始信息放入历史记录中
        var historyPointData = [];
        var histaryPathData = [];
        for(var j in pointData)
        {
            historyPointData.push(copyPoint(pointData[i]));
        }
        for(var j in pathData)
        {
            histaryPathData.push([pathData[j][0], pathData[j][1]])
        }
        historyRecord.push([historyPointData , histaryPathData]);    //历史记录

        //删除操作
        pointData.splice(index, 1);
        pathData = [];
        pathData = getDimensionPointPath(pointData);   //重新得到路径信息

        DynamicSelect.DimensionPoint = pointData;        //维度点集
        DynamicSelect.PathInfo = pathData;         //路径集合
        DynamicSelect.HistaryInfo = historyRecord;    //历史记录
    }
}
/**
 * 回退操作
 * @param DynamicSelect：选择记录器
 */
function fallBackDynamicSelect(DynamicSelect)
{
    var pointData = DynamicSelect.DimensionPoint;        //维度点集
    var pathData = DynamicSelect.PathInfo;         //路径集合
    var historyRecord = DynamicSelect.HistaryInfo;    //历史记录

    if(historyRecord.length >0)
    {
        var temp1 = [];
        var temp2 = [];
        var hisPoint = historyRecord[historyRecord.length-1][0];
        var hisPath = historyRecord[historyRecord.length-1][1];
        for(var i=0; i< hisPoint.length; i++)
        {
            temp1.push(copyPoint(hisPoint[i]));
        }
        for(var i=0; i<hisPath.length; i++)
        {
            temp2.push([hisPath[i][0], hisPath[i][1]]);
        }
        pointData = temp1;
        pathData = temp2;
        historyRecord.splice(historyRecord.length-1, 1);
    }

    DynamicSelect.DimensionPoint = pointData;        //维度点集
    DynamicSelect.PathInfo = pathData;         //路径集合
    DynamicSelect.HistaryInfo = historyRecord;    //历史记录
}
/**
 * 得到点集点一条环绕路径
 * @param pointData:点集
 * @returns {Array}：路径
 */
function getDimensionPointPath(pointData)
{
    var path = [];

    var maxX = d3.max(pointData, function(d){return pointData.Coordinate[0]});
    var minX = d3.min(pointData, function(d){return pointData.Coordinate[0]});
    var halfX = (maxX+minX)/2;

    var leftPart = [];
    var rightPart = [];

    for(var i in pointData)  //分块
    {
        if(pointData[i].Coordinate[0] >= halfX)
        {
            rightPart.push(pointData[i]);
        }
        else
        {
            leftPart.push(pointData[i]);
        }
    }

    //根据y值排序
    var temp0 = [];
    for(var i in leftPart) {
        for (var j = i + 1; j < leftPart.length; j++) {
            if (leftPart[i].Coordinate[1] < leftPart[j].Coordinate[1]) {
                temp0 = leftPart[i];
                leftPart[i] = leftPart[j];
                leftPart[j] = temp0;
            }
        }

    }
    for(var i in rightPart)
    {
        for(var j=i+1; j<rightPart.length; j++)
        {
            if(rightPart[i].Coordinate[1] > rightPart[j].Coordinate[1])
            {
                temp0 = rightPart[i];
                rightPart[i] = rightPart[j];
                rightPart[j] = temp0;
            }
        }
    }

    leftPart = leftPart.concat(rightPart);  //合并
    var len = leftPart.length;
    for(var i=0; i<leftPart.length; i++)   //得到路径
    {
        path.push([leftPart[i].ID , leftPart[(i+1)%len].ID]);
    }

    return path;

}