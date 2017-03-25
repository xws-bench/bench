util.getOutlineRangeTest = TestCase("util.getOutlineRange");
var td = window.td;
var unit;
var target;
var obstacles = [];

util.getOutlineRangeTest.prototype.setUp = function() {
    unit = td.object('getOutlinePoints');
    target = td.object('getOutlinePoints');
};

util.getOutlineRangeTest.prototype.testRangeOneDiagonal = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:100,y:100},{x:140,y:100},{x:140,y:140},{x:100,y:140}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(1, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeTwoDiagonal = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:150,y:150},{x:190,y:150},{x:190,y:190},{x:150,y:190}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(2, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeThreeDiagonal = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:200,y:200},{x:240,y:200},{x:240,y:240},{x:200,y:240}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(3, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeFourDiagonal = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:300,y:300},{x:340,y:300},{x:340,y:340},{x:300,y:340}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(4, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeOneVertical= function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:100},{x:40,y:100},{x:40,y:140},{x:0,y:140}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(1, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeTwoVertical = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:150},{x:40,y:150},{x:40,y:190},{x:0,y:190}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(2, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeThreeVertical = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:250},{x:40,y:250},{x:40,y:290},{x:0,y:290}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(3, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testRangeFourVertical = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:0},{x:40,y:0},{x:40,y:40},{x:0,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:0,y:350},{x:40,y:350},{x:40,y:390},{x:0,y:390}]);

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(4, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testObstuctedOnce = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:0},{x:50,y:0},{x:50,y:40},{x:10,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:150},{x:50,y:150},{x:50,y:190},{x:10,y:190}]);

    var astroid = td.object(['getOutlineString']);
    astroid.type=ROCK;
    td.when(astroid.getOutlineString()).thenReturn({p:[{x:0,y:100},{x:60,y:100},{x:60,y:140},{x:0,y:140}]});
    obstacles = [astroid];

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(2, result.distance);
    assertEquals(true, result.obstructed);
    assertEquals(1, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testObstuctedTwice = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:0},{x:50,y:0},{x:50,y:40},{x:10,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:150},{x:50,y:150},{x:50,y:190},{x:10,y:190}]);

    var astroid = td.object(['getOutlineString']);
    astroid.type=ROCK;
    td.when(astroid.getOutlineString()).thenReturn({p:[{x:0,y:100},{x:60,y:100},{x:60,y:140},{x:0,y:140}]});

    var astroid2 = td.object(['getOutlineString']);
    astroid.type=ROCK;
    td.when(astroid2.getOutlineString()).thenReturn({p:[{x:0,y:50},{x:60,y:50},{x:60,y:90},{x:0,y:90}]});

    obstacles = [astroid,astroid2];

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(2, result.distance);
    assertEquals(true, result.obstructed);
    assertEquals(2, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testObstuctedOnceDebris = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:0},{x:50,y:0},{x:50,y:40},{x:10,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:150},{x:50,y:150},{x:50,y:190},{x:10,y:190}]);

    var debris = td.object(['getOutlineString']);
    debris.type=DEBRIS;
    td.when(debris.getOutlineString()).thenReturn({p:[{x:0,y:100},{x:60,y:100},{x:60,y:140},{x:0,y:140}]});
    obstacles = [debris];

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(2, result.distance);
    assertEquals(true, result.obstructed);
    assertEquals(1, result.obstructionCount);
};

util.getOutlineRangeTest.prototype.testObstuctedByBomb = function() {
    td.when(unit.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:0},{x:50,y:0},{x:50,y:40},{x:10,y:40}]);
    td.when(target.getOutlinePoints(td.matchers.anything())).thenReturn([{x:10,y:150},{x:50,y:150},{x:50,y:190},{x:10,y:190}]);

    var bomb = td.object(['getOutlineString']);
    bomb.type=BOMB;
    td.when(bomb.getOutlineString()).thenReturn({p:[{x:0,y:100},{x:60,y:100},{x:60,y:140},{x:0,y:140}]});
    obstacles = [bomb];

    var result = util.getOutlineRange(unit,target, obstacles);
    assertEquals(2, result.distance);
    assertEquals(false, result.obstructed);
    assertEquals(0, result.obstructionCount);
};

