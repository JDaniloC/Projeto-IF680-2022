var curves = [{
    points: [],
    color: 'black'
}];
var isDragging = false;
var currentPoint = {
    x: 0, y: 0
};
var currentCurve = 0;

function updateCurrentPoint(event) {
    currentPoint = {
        x: event.offsetX,
        y: event.offsetY
    };
    return currentPoint;
}

function updateCurrentCurve(point) {
    if (curves[currentCurve].points.length === 2) {
        curves[currentCurve].points[1] = point;
    } else {
        curves[currentCurve].points.push(point);
    }
}

function addNewCurve(pointA, pointB) {
    curves.push({
        points: [pointA, pointB],
        color: 'black'
    });
    currentCurve = curves.length - 1;
}
