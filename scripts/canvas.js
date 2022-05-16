class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.addEventListener("mousedown", (event) => {
            updateCurrentPoint(event);
            isDragging = true;
        });
        
        this.canvas.addEventListener("mousemove", (event) => {
            if (!isDragging) {
                return;
            }
            updateCurrentPoint(event);
            this.redraw();
            this.drawPoint(currentPoint);
        });
        
        this.canvas.addEventListener("mouseup", (event) => {
            isDragging = false;
            updateCurrentCurve(currentPoint);
            this.redraw();
        });
    }

    clear() {
        const { width, height } = this.canvas;
        this.canvasCtx.clearRect(0, 0, width, height);
    }

    drawPoint(point) {
        const radius = 3;
        this.canvasCtx.beginPath();
        this.canvasCtx.fillStyle = "#CCC";
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

    drawLines(points, color) {
        for (let index = 1; index < points.length; index++) {
            const point = points[index];
            this.drawPoint(point);
            this.drawLine(points[index - 1], point, color);   
        }
    }

    drawCurves(curves) {
        curves.forEach(curve => {
            if (curve.points.length === 0) {
                return;
            }
            this.drawPoint(curve.points[0]);
            if (curve.points.length === 1) {
                return;
            }
            this.drawLines(curve.points, curve.color);
        });
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

    drawBezierCurve(curve) {
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
        this.drawLines(bezierCurves, "#000");
    }

    redraw() {
        this.clear();
        this.drawCurves(curves);
        curves.forEach(curve => {
            this.drawBezierCurve(curve);
        });
    }
}

const canvas = new Canvas('canvas');
