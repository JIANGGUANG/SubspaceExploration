/**
 * Created by jiangguang on 2016/4/16.
 */

/**
 * ��̬ѡ���¼����
 *
 * @returns {Array}  ����һ���µĶ�̬ѡ���¼��
 */
function getADynamicSelect()
{
    var mDynamicSelectDataInfo = new Object() ;     //��̬��¼ѡ��Ĺ�����Ϣ 1:ѡ�е�ά�ȵ㼯 2��·����Ϣ 3��������ʷ��¼
    mDynamicSelectDataInfo.DimensionPoint = [];     //ѡ�е�ά�ȵ㼯
    mDynamicSelectDataInfo.PathInfo = [];     //·����Ϣ [i,j]   i ��ʼ��j ����
    mDynamicSelectDataInfo.HistaryInfo = [];     //������ʷ��¼[i,j] i ά����Ϣ��j ·����Ϣ

    return mDynamicSelectDataInfo;
}

/**
 * ����µ�ά�ȵ�����̬ѡ���¼��
 * @param DynamicSelect:��̬ѡ���¼��
 * @param pointInfo:�µ�ά�ȵ���Ϣ
 */
function addToDynamicSelect(DynamicSelect, pointInfo)
{
    var pointData = DynamicSelect.DimensionPoint;        //ά�ȵ㼯
    var pathData = DynamicSelect.PathInfo;         //·������
    var historyRecord = DynamicSelect.HistaryInfo;    //��ʷ��¼

    var i=0;
    for(i=0; i<pointData.length; i++)  //�жϵ�ǰ�ӵõ��Ƿ�Ϊ�ظ���
    {
        if(pointData[i].ID == pointInfo.ID)
        {
            i= i-1;  //�������һ��Ԫ��ʱ������ͨ��i == pointData.length-1 ���ж��Ƿ����ظ���
            break;
        }
    }
    if(i>=pointData.length-1)
    {
        //���Ƚ�ԭʼ��Ϣ������ʷ��¼��
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
        historyRecord.push([historyPointData , histaryPathData]);    //��ʷ��¼

        //���²���
        pointData.push(copyPoint(pointInfo));

        pathData = [];
        pathData = getDimensionPointPath(pointData);   //���µõ�·����Ϣ

        DynamicSelect.DimensionPoint = pointData;        //ά�ȵ㼯
        DynamicSelect.PathInfo = pathData;         //·������
        DynamicSelect.HistaryInfo = historyRecord;    //��ʷ��¼
    }
}
/**
 * ɾ����̬ѡ�����е�ĳ��ά�ȵ�
 * @param DynamicSelect
 * @param pointInfo
 */
function delDynamicSelect(DynamicSelect, pointInfo)
{
    var pointData = DynamicSelect.DimensionPoint;        //ά�ȵ㼯
    var pathData = DynamicSelect.PathInfo;         //·������
    var historyRecord = DynamicSelect.HistaryInfo;    //��ʷ��¼

    var i= 0, index =0;
    for(i=0; i<pointData.length; i++)
    {
        if(pointData[i].ID == pointInfo.ID)
        {
           index = i;
            i = i-1;//�������һ��Ԫ��ʱ������ͨ��i == pointData.length-1 ���ж��Ƿ����ظ���
            break;
        }
    }

    if(i>=pointData.length-1)
    {
        //���Ƚ�ԭʼ��Ϣ������ʷ��¼��
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
        historyRecord.push([historyPointData , histaryPathData]);    //��ʷ��¼

        //ɾ������
        pointData.splice(index, 1);
        pathData = [];
        pathData = getDimensionPointPath(pointData);   //���µõ�·����Ϣ

        DynamicSelect.DimensionPoint = pointData;        //ά�ȵ㼯
        DynamicSelect.PathInfo = pathData;         //·������
        DynamicSelect.HistaryInfo = historyRecord;    //��ʷ��¼
    }
}
/**
 * ���˲���
 * @param DynamicSelect��ѡ���¼��
 */
function fallBackDynamicSelect(DynamicSelect)
{
    var pointData = DynamicSelect.DimensionPoint;        //ά�ȵ㼯
    var pathData = DynamicSelect.PathInfo;         //·������
    var historyRecord = DynamicSelect.HistaryInfo;    //��ʷ��¼

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

    DynamicSelect.DimensionPoint = pointData;        //ά�ȵ㼯
    DynamicSelect.PathInfo = pathData;         //·������
    DynamicSelect.HistaryInfo = historyRecord;    //��ʷ��¼
}
/**
 * �õ��㼯��һ������·��
 * @param pointData:�㼯
 * @returns {Array}��·��
 */
function getDimensionPointPath(pointData)
{
    var path = [];

    var maxX = d3.max(pointData, function(d){return pointData.Coordinate[0]});
    var minX = d3.min(pointData, function(d){return pointData.Coordinate[0]});
    var halfX = (maxX+minX)/2;

    var leftPart = [];
    var rightPart = [];

    for(var i in pointData)  //�ֿ�
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

    //����yֵ����
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

    leftPart = leftPart.concat(rightPart);  //�ϲ�
    var len = leftPart.length;
    for(var i=0; i<leftPart.length; i++)   //�õ�·��
    {
        path.push([leftPart[i].ID , leftPart[(i+1)%len].ID]);
    }

    return path;

}