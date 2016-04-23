var MDS = function(distances, dimensions) {
    dimensions = dimensions || 2;

    // square distances
    var M = numeric.mul(-0.5, numeric.pow(distances, 2));

    // double centre the rows/columns
    function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    var rowMeans = mean(M),
        colMeans = mean(numeric.transpose(M)),
        totalMean = mean(rowMeans);

    for (var i = 0; i < M.length; ++i) {
        for (var j =0; j < M[0].length; ++j) {
            M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
    }

    // take the SVD of the double centred matrix, and return the
    // points from it
    var ret = numeric.svd(M),
        eigenValues = numeric.sqrt(ret.S);
    return ret.U.map(function(row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
    });
};

function mdsTwst()
{
    console.log("start");
    var t1 = [0, 2, 1, 2];
    var t2 = [2, 0, 1, 4];
    var t3 = [1, ,1, 0,1];
    var t4 = [2,4,1,0];
    var t=[];
    t.push(t1);
    t.push(t2);
    t.push(t3);
    t.push(t4);

    var d1 = [0, 2, 4, 2, 1];
    var d2 = [2, 0, 2, 4, 1];
    var d3 = [4, 2, 0, 2, 1];
    var d4 = [2, 4, 2, 0, 1];
    var d5 = [1, 1, 1, 1, 0];
    var d=[];
    d.push(d1);
    d.push(d2);
    d.push(d3);
    d.push(d4);
    d.push(d5);


    var  res = MDS(d, 2);
    for(var i in res)
    {
        console.log(res[i]);
    }
}

function testMds(data)
{
    var formData = new FormData();
    formData.append("id","requestMDS");
    formData.append("csrfmiddlewaretoken", token);
    $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    });

    $.ajax(
        {
            url:"/",
            type:"POST",
            data:formData,
            processData: false,
            contentType: false,
            success:function(data){
                console.log(data);
            },
            error:function(data){
            }
        });
}