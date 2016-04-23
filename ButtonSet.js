/**
 * Created by jiangguang on 2016/4/18.
 */
/**
 * 所有按钮设置都在这
 */

function reactionToButton1()
{
    var  temp = [];
    for(var i in LOCALSelectDIMPoint)
    {
        temp.push(WHOLEDimensionPoint[LOCALSelectDIMPoint[i]][0]);
    }
    console.log(temp);
    initPmdsView(temp);
}

function reactionToButton2()
{
    initDmdsView()
}

function reactionToButton3()
{
    console.log(WHOLEPointData);
}

function reactionToButton4()
{
  // mdsTwst()
    //console.log(LOCALSelectDIMPoint);
    //var d1 = [0, 2, 4, 2, 1];
    //var d2 = [2, 0, 2, 4, 1];
    //var d3 = [4, 2, 0, 2, 1];
    //var d4 = [2, 4, 2, 0, 1];
    //var d5 = [1, 1, 1, 1, 0];
    //var d=[];
    //d.push(d1);
    //d.push(d2);
    //d.push(d3);
    //d.push(d4);
    //d.push(d5);
    testMds([1,2]);
}

function reactionToSelectData()
{
    WHOLEK = 9;        //邻域范围
    var dataName = document.getElementById("selectData").value;  //获取用户选择的文件名

    InitAllData(dataName);   //读取csv文件 得到所有点对象的集合， 和维度点对象集合

    setTimeout(function () {
        {
            initDmdsView();
        }
    },1000);

}