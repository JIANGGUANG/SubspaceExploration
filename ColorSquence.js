/**
 * Created by jiangguang on 2016/4/17.
 */

//全局变量声明
//var WHOLEColor =  ["#34495E","yellow","#3399CC","#b3de69","#fb8072","#bc80bd",
//    "#b15928","#8dd3c7","#336633","#dbdb8d","#bebada","#ccebc5",
//    "#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b",
//    "#e377c2","#7f7f7f","#bcbd22","#9edae5","#669999"];
/**
 * 应该没有相同
 * @type {string[]}
 */
var WHOLEColor = ["#2b4490", "#4e72b8", "#0c212b", "#6f6d85", "#694d9f", "#ea66a6", "#2585a6", "#2570a1","#7bbfea",
    "##11264f", "##145b7d", "#009ad6", "#008792", "#70a19f", "#293047", "#122e29", "#375830","#007947",
    "#deab8a", "#fedcbd", "#905a3d", "#87481f", "#6b473c", "#fab27b", "#843900", "#8c531b","#ae6642",
    "#b36d41", "#8f4b4a", "#733a31", "#f15a22", "#84331f", "#f15a22", "#f3704b", "#8e3e1f","#de773f"]
// 所有颜色
var WHOLEColorIndex = 0;                                       //颜色索引

/**
 * 得到颜色
 * @returns {string}
 */
function getAColor()
{
    var length = WHOLEColor.length;
    WHOLEColorIndex++;
    return WHOLEColor[WHOLEColorIndex%length];
}
/**
 * 得到一个指定的颜色
 * @param index:颜色索引
 * @returns {string}
 */
function getColor(index)
{
    var length = WHOLEColor.length;
    return WHOLEColor[index%length];
}

