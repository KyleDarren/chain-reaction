export default class Token {
    constructor(ctx, canvas, x, y, radius, color) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity_x = 0;
        this.velocity_y = 10;
        this.angle = 0;

        
    }

    move() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.x += this.velocity_x;
        this.y += this.velocity_y;
        this.allowBoundaryCollision();
    }

    // move2() {
    //     this.ctx.beginPath();
    //     this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    //     this.ctx.fillStyle = "blue";
    //     this.ctx.fill();
    //     this.x += -this.velocity_x;
    //     this.y += -this.velocity_y;
    //     this.allowBoundaryCollision();

    //     this.ctx.font = "30px Arial"; // Font size and type
    //     this.ctx.fillStyle = "white"; // Fill color

    //     // Add filled text
    //     this.ctx.fillText(this.angle, this.x-this.radius/2, this.y);
    // }

    allowBoundaryCollision() {
        if (this.x + this.radius/2 >= this.canvas.width ||
            this.x - this.radius/2 <= 0
        ) {
            this.velocity_x = -this.velocity_x;
        }

        if (this.y + this.radius/2 >= this.canvas.height ||
            this.y - this.radius/2 <= 0
        ) {
            this.velocity_y = -this.velocity_y;
        }
    }

    collission(circle) {
        let live_distance = Math.abs(Math.sqrt(((circle.x - this.x)**2) + ((circle.y - this.y)**2)));

        let reference_distance = this.radius + circle.radius;

        if (live_distance <= reference_distance) {
            return true;
        }
    }

    resolveCollision(other) {
        if (this.color == "blue") {
            other.color = "blue";
        } else if (this.color == "red") {
            other.color = "red";
        }
        // Calculate normal and tangent vectors
        let nx = other.x - this.x;
        let ny = other.y - this.y;
        let dist = Math.sqrt(nx * nx + ny * ny);
        nx /= dist;
        ny /= dist;
    
        // Tangent vector
        let tx = -ny;
        let ty = nx;
    
        // Dot products for velocities
        let v1n = this.velocity_x * nx + this.velocity_y * ny;
        let v1t = this.velocity_x * tx + this.velocity_y * ty;
        let v2n = other.velocity_x * nx + other.velocity_y * ny;
        let v2t = other.velocity_x * tx + other.velocity_y * ty;
    
        // Swap normal velocities (elastic collision)
        let temp = v1n;
        v1n = v2n;
        v2n = temp;
    
        // Convert scalar normal and tangential velocities to vectors
        this.velocity_x = v1n * nx + v1t * tx;
        this.velocity_y = v1n * ny + v1t * ty;
        other.velocity_x = v2n * nx + v2t * tx;
        other.velocity_y = v2n * ny + v2t * ty;
    }

    checkOverlap(circle) {
        let live_distance = Math.abs(Math.sqrt(((circle.x - this.x)**2) + ((circle.y - this.y)**2)));

        let reference_distance = this.radius + circle.radius;

        return live_distance <= reference_distance;            
    }

    drawLine(circle) {
        let live_distance = Math.abs(Math.sqrt(((circle.x - this.x)**2) + ((circle.y - this.y)**2)));
        let reference_distance = this.radius + circle.radius;

        if (live_distance <= reference_distance+50) {
            // Set the line color and width
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 2;

            // Start drawing the line
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y); // Starting point (x, y)
            this.ctx.lineTo(circle.x, circle.y); // Ending point (x, y)
            this.ctx.stroke(); // Render the line
            
            // this.ctx.beginPath();
            // this.ctx.moveTo(this.x, this.y); // Starting point (x, y)
            // this.ctx.lineTo(circle.x, this.y); // Ending point (x, y)
            // this.ctx.stroke(); // Render the line

            // this.ctx.beginPath();
            // this.ctx.moveTo(circle.x, this.y); // Starting point (x, y)
            // this.ctx.lineTo(circle.x, circle.y); // Ending point (x, y)
            // this.ctx.stroke(); // Render the line

            
        }
    }
}