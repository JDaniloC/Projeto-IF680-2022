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

    interpolate(pointA, pointB, t){
        return {
            x: ((1-t) * pointA.x + t * pointB.x),
            y: ((1-t) * pointA.y + t * pointB.y)
        }
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

    deCasteljau(points, t) {
        const grade = points.length - 1;
        if (grade === 1) {
            return this.interpolate(points[0], points[1], t);
        } 
        const newPoints = [];
        for (let i = 0; i < grade; i++) {
            newPoints.push(this.interpolate(points[i], points[i+1], t));
        }
        return this.deCasteljau(newPoints, t);
    }

    drawBezierCurve(curve, isCurrentCurve = false) {
        const points = curve.points;
        if (points.length <= 2) {
            return;
        }

        let bezierCurves = [];
        bezierCurves.push(points[0]);
        for (let i = 1; i <= numIterations - 2; i++) {
            bezierCurves.push(this.deCasteljau(points, i / numIterations));
        }
        bezierCurves.push(points[points.length - 1]);
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
