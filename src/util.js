/**
 * Created by Darren on 02/03/2017.
 */
function util () {}

util.getOutlineRange = function (unit, target, obstacles) {
    var rUnit= unit.getOutlinePoints(unit.m);
    var rTarget = target.getOutlinePoints(target.m);
    var min=90001;
    var i,j,k;
    var str="";
    var obsructed=false;
    var countObstructions=0;
    var minobs=false,mini,minj;
    for (i=0; i<rUnit.length; i++) {
        for (j=0; j<rTarget.length; j++) {
            var distanceBetweenPoints=dist(rTarget[j],rUnit[i]);
            if (distanceBetweenPoints<min) {
                min=distanceBetweenPoints; mini=i; minj=j;
            }
        }
    }
    if (min>90000) return {distance:4,obstructed:obsructed,obstructionCount:countObstructions};
    var dx=rTarget[minj].x-rUnit[mini].x;
    var dy=rTarget[minj].y-rUnit[mini].y;
    var a=-rUnit[mini].x*dy+rUnit[mini].y*dx; //(x-x0)*dy-(y-y0)*dx>0
    if (obstacles.length>0) {
        for (k=0; k<obstacles.length; k++) {
            if (obstacles[k].type==NONE || obstacles[k].type==BOMB) continue;
            var obstaclePoints=obstacles[k].getOutlineString().p;
            // The object is not yet intialized. Should not be here...
            if (obstaclePoints.length==0) break;
            var s=obstaclePoints[0].x*dy-obstaclePoints[0].y*dx+a;
            var v=s;
            for (i=1; i<obstaclePoints.length; i++) {
                if (dist(rTarget[minj],obstaclePoints[i])<1.2*min&&
                    dist(rUnit[mini],obstaclePoints[i])<1.2*min) {
                    v=obstaclePoints[i].x*dy-obstaclePoints[i].y*dx+a;
                    if (v*s<0) break;
                }
            }
            if (v*s<0) {
                obsructed=true;
                countObstructions++;
            }

        }
    }
    if (min<=10000) return {distance:1,obstructed:obsructed,obstructionCount:countObstructions};
    if (min<=40000) return { distance:2,obstructed:obsructed,obstructionCount:countObstructions};
    return {distance:3,obstructed:obsructed,obstructionCount:countObstructions};
};
