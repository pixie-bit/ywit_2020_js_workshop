class Ship {
    constructor() {
        this.position = createVector(width / 2, height / 2);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.last_fired = 0;
        this.bullets = [];
        this.destroyed = false;
        this.r = 10;
    }

    /**
     * Anything that should be calculated each frame should be put here
     */
    update() {
        if (keyIsDown(32) && frameCount - this.last_fired > 6) {
            this.fire();
        }

        if (keyIsDown(87)) {
            let mouse = createVector(mouseX, mouseY);
            this.acceleration = p5.Vector.sub(mouse, this.position);
            this.acceleration.setMag(.2);
        } else if (this.velocity.mag() > 0) {
            // shortcut for friction (that doesn't even exist in space)
            this.velocity.mult(.95);
        }

        // move the ship around
        this.velocity.add(this.acceleration).limit(5);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        // wrap around
        if (this.position.x > width) {
            this.position.x -= width;
        }
        if (this.position.x < 0) {
            this.position.x = width - this.position.x;
        }
        if (this.position.y > height) {
            this.position.y -= height;
        }
        if (this.position.y < 0) {
            this.position.y = height - this.position.y;
        }

        // move the bullets around
        for (let bullet of this.bullets) {
            bullet.update();
        }

        // remove any bullets that may have travelled offscreen
        this.bullets = this.bullets.filter(bullet => !bullet.destroyed);
    }

    /**
     * Draws our player's ship (which is basically a triangle)
     */
    draw() {
        this.update();
        for (let bullet of this.bullets) {
            bullet.draw();
        }
        push();
        noFill();
        stroke(255, 255, 255);
        let angle = atan2(mouseY - this.position.y, mouseX - this.position.x);
        translate(this.position.x, this.position.y);
        rotate(angle);
        triangle(-this.r, -this.r, this.r * 1.5, 0, -this.r, this.r);
        pop();
    }

    /**
     * Fire one bullet. This adds a bullet to the array currently being tracked.
     * It starts at the nose of the ship and will move forward with each frame.
     */
    fire() {
        this.last_fired = frameCount;
        this.bullets.push(new Bullet(this.position.x + 15, this.position.y));
    }
}

class Bullet {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(mouseX - x, mouseY - y).normalize().mult(6);
        this.destroyed = false;
    }

    update() {
        this.position.add(this.velocity);
        // bullet dies if it goes offscreen
        if (this.position.x > width) {
            this.destroyed = true;
        }
        if (this.position.x < 0) {
            this.destroyed = true;
        }
        if (this.position.y > height) {
            this.destroyed = true;
        }
        if (this.position.y < 0) {
            this.destroyed = true;
        }
    }

    draw() {
        this.update();
        push();
        fill(255, 255, 255);
        stroke(255,255, 255);
        circle(this.position.x, this.position.y, 2);
        pop();
    }
}