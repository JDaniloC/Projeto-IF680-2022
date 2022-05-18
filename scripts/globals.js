var curves = [{
    points: [],
    color: '#CCC'
}];
var currentPoint = {
    x: 0, y: 0
};

var pointRadius = 3;
var isDragging = false;

var currentCurve = 0;
var numIterations = 5;
var currentPointIndex = -1;

var iterationsInput = null;
var linhasInput = null;
var pontosInput = null;
var curvasInput = null;

function loadDomReferences() {
    iterationsInput = document.querySelector("#avaliacoes");
    linhasInput = document.querySelector("input[name='linhas']");
    pontosInput = document.querySelector("input[name='pontos']");
    curvasInput = document.querySelector("input[name='curvas']");
}

function intersectPoint(pointA, pointB) {
    const XPoint = pointA.x - pointB.x;
    const YPoint = pointA.y - pointB.y;
    const difference = Math.pow(XPoint, 2) + Math.pow(YPoint, 2);
    return Math.sqrt(difference) <= pointRadius;
}

function isCurrentPointIndex(point) {
    if (currentPointIndex === -1) return false;
    const currentPoint = curves[currentCurve].points[currentPointIndex];
    if (intersectPoint(point, currentPoint)) {
        return true;
    }
    return false;
}

function verifyIntersection(point) {
    const currentPoints = curves[currentCurve].points;
    for (let index = 0; index < currentPoints.length; index++) {
        const element = currentPoints[index];
        if (intersectPoint(point, element)) {
            return index;
        }
    }
    return -1;
}

function updateCurrentPoint(event) {
    currentPoint = {
        x: event.offsetX,
        y: event.offsetY,
        color: '#CCC'
    };
    return currentPoint;
}

function editCurvePoint(point, index = -1) {
    if (index === -1) {
        index = curves[currentCurve].points.length - 1;
    }
    curves[currentCurve].points[index] = point;
}

function addPointToCurve() {
    curves[currentCurve].points.push(currentPoint);
}

function addNewCurve() {
    curves.push({
        points: [],
        color: '#CCC'
    });
    currentCurve = curves.length - 1;
}

function redraw() {
    canvas.redraw();
}

function switchCurrentCurve() {
    currentCurve = (currentCurve + 1) % curves.length;
    redraw()
}

function deleteCurve() {
    curves.splice(currentCurve, 1);
    if (curves.length === 0) {
        addNewCurve();
    }
    currentCurve = (currentCurve + 1) % curves.length;
    redraw();
}

function deletePoint() {
    if (currentPointIndex === -1) {
        curves[currentCurve].points.pop();
    } else {
        curves[currentCurve].points.splice(currentPointIndex, 1);
    }
    redraw();
}

function updateNumIterations(event) {
    numIterations = event.value;
    iterationsInput.value = numIterations;
    redraw();
}