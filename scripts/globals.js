var curves = [{
    points: [],
    color: '#CCC'
}];
var isDragging = false;
var isEditingPoint = false;
var currentPoint = {
    x: 0, y: 0
};
var currentCurve = 0;
var numIterations = 100;

function updateCurrentPoint(event) {
    currentPoint = {
        x: event.offsetX,
        y: event.offsetY
    };
    return currentPoint;
}

function updateCurrentCurve(point) {
    if (isEditingPoint) {
        return curves[currentCurve].points[1] = point;
    } 

    console.log(point);
    
    curves[currentCurve].points.push(point);
}

function addNewCurve(pointA) {
    curves.push({
        points: [pointA],
        color: 'black'
    });
    currentCurve = curves.length - 1;
}
