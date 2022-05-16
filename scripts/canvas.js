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
        this.canvasCtx.fillStyle = "black";
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

    redraw() {
        this.clear();
        curves.forEach(curve => {
            if (curve.points.length === 0) {
                return;
            }
            this.drawPoint(curve.points[0]);
            if (curve.points.length === 1) {
                return;
            }
            this.drawPoint(curve.points[1]);
            this.drawLine(curve.points[0], curve.points[1], curve.color);
        });
    }
}

const canvas = new Canvas('canvas');
