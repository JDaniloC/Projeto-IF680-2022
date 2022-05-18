class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.addEventListener("mousedown", (event) => {
            isDragging = true;
            currentPointIndex = -1;
            
            const newPoint = updateCurrentPoint(event);
            const index = verifyIntersection(newPoint);
            if (index > -1) {
                currentPointIndex = index;
            } else {
                addPointToCurve();
            }
            this.redraw();
        });
        
        this.canvas.addEventListener("mousemove", (event) => {
            if (!isDragging) {
                return;
            }
            currentPoint = updateCurrentPoint(event);
            editCurvePoint(currentPoint, currentPointIndex);
            this.redraw();
        });
        
        this.canvas.addEventListener("mouseup", (event) => {
            isDragging = false;
        });
    }

    clear() {
        const { width, height } = this.canvas;
        this.canvasCtx.clearRect(0, 0, width, height);
    }

    drawPoint(point, color = "#CCC") {
        this.canvasCtx.beginPath();
        let radius = pointRadius;
        if (isCurrentPointIndex(point)) {
            radius *= 2;
        }
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.arc(point.x, point.y, radius , 0, 2 * Math.PI);
        this.canvasCtx.fill();
    }
    
    drawLine(pointA, pointB, lineColor) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(pointA.x, pointA.y);
        this.canvasCtx.lineTo(pointB.x, pointB.y);
        this.canvasCtx.strokeStyle = lineColor;
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.stroke();
    }

    drawLines(points, color, isControl = false) {
        for (let index = 1; index < points.length; index++) {
            const point = points[index];
            if (pontosInput.checked) {
                const pointColor = isControl ?  "#CCC" : "red";
                this.drawPoint(point, pointColor);
            }
            if ((linhasInput.checked && isControl) || !isControl) {
                this.drawLine(points[index - 1], point, color);   
            }
        }
    }

    interpolate(pointA, pointB, t) {
        return {
            x: ((1-t) * pointA.x + t * pointB.x),
            y: ((1-t) * pointA.y + t * pointB.y)
        }
    }

    playReplay(maxIndex = replayCurves.length) {
        this.clear();
        let pointColor = "#CCC";
        if (maxIndex == replayCurves.length) {
            const bezierCurves = replayCurves[maxIndex - 1].bezierCurves;
            this.drawControlPoligonals([replayCurves[0].curve]);
            return this.drawLines(bezierCurves, "#3f51b5");
        }
        for (let index = 0; index < maxIndex; index++) {
            const info = replayCurves[index];
            switch(info.type) {
                case "control":
                    this.drawControlPoligonals([info.curve]);
                    break
                case "interpolate":
                    pointColor = "#CCC";
                    if (index === maxIndex - 1) {
                        this.drawPoint(info.A, "orange");
                        this.drawPoint(info.B, "orange");
                        pointColor = "red";
                    }
                    this.drawPoint(info.point, pointColor);
                    break
                case "line":
                    if (index === maxIndex - 1) {
                        this.drawLine(info.A, info.B, "red");
                    }
                    break
                case "point":
                    pointColor = "orange";
                    if (index === maxIndex - 1) {
                        pointColor = "red";
                    }
                    this.drawPoint(info.point, pointColor);
            }
        }
    }

    deCasteljau(points, t, canReplay = false) {
        const grade = points.length - 1;
        if (grade === 1) {
            if (canReplay) replayCurves.push({
                A: points[0],
                B: points[1], 
                type: "line" 
            });
            return this.interpolate(points[0], points[1], t);
        } 
        const newPoints = [];
        for (let i = 0; i < grade; i++) {
            const pointA = points[i];
            const pointB = points[i + 1];
            const newPoint = this.interpolate(pointA, pointB, t)
            if (canReplay) {
                replayCurves.push({
                    A: pointA,
                    B: pointB, 
                    type: "line" 
                });
                replayCurves.push({
                    A: pointA, 
                    B: pointB, 
                    point: newPoint, 
                    type: "interpolate" 
                });
            }
            newPoints.push(newPoint);
        }
        return this.deCasteljau(newPoints, t, canReplay);
    }

    drawBezierCurve(curve, isCurrentCurve = false) {
        const points = curve.points;
        if (points.length <= 2) {
            return;
        }

        let bezierCurves = [];
        if (isCurrentCurve) {
            replayCurves = [{
                type: "control", curve
            }];
        }
        bezierCurves.push(points[0]);
        for (let i = 1; i <= numIterations - 2; i++) {
            const position = i / numIterations;
            const newPoint = this.deCasteljau(points, position, isCurrentCurve);
            if (isCurrentCurve) replayCurves.push({ 
                point: newPoint, 
                type: "point", 
                position 
            });
            bezierCurves.push(newPoint);
        }
        bezierCurves.push(points[points.length - 1]);
        if (isCurrentCurve) {
            replayCurves.push({
                type: "bezier", bezierCurves
            });
            replayInput.max = replayCurves.length;
        }
        this.drawLines(bezierCurves, isCurrentCurve ? "#ff6600" : "#000");
    }

    
    drawControlPoligonals(curves) {
        curves.forEach(curve => {
            if (curve.points.length === 0) {
                return;
            }
            if (pontosInput.checked) {
                this.drawPoint(curve.points[0]);
            }
            if (curve.points.length === 1) {
                return;
            }
            this.drawLines(curve.points, curve.color, true);
        });
    }

    redraw() {
        this.clear();
        if (curvasInput.checked) {
            for (let index = 0; index < curves.length; index++) {
                const curve = curves[index];
                this.drawBezierCurve(curve, index === currentCurve);
            }
        }
        this.drawControlPoligonals(curves);
    }
}

const canvas = new Canvas('canvas');
const replay = new Canvas('replay');
