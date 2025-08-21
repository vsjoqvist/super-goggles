class Object {
  constructor(pos) {
    this.pos = pos;
  }

  //Runs after game.js has loaded
  init() {}

  update(dt) {}

  draw(ctx, canvas) {}
}

//Only circles
class CollisionObject extends Object {
  constructor(pos, radius, mass, vel) {
    super(pos);
    this.radius = radius;
    this.mass = mass;
    this.vel = vel;
  }

  update(dt) {
    this.pos = this.pos.add(this.vel.scale(dt));

    //Inefficient, every collsion is checked twice
    collisionObjects.forEach((n) => {
      let other = objects[n];

      //Collided
      let distance = this.pos.distance(other.pos);
      if (distance < this.radius + other.radius) {
        //normalized collision line
        const l = other.pos.subtract(this.pos).normalize();

        //relative velocity along collsion line
        const v =
          (2 * this.vel.subtract(other.vel).dot(l)) / (this.mass + other.mass);

        //Update velocities
        this.vel = this.vel.subtract(l.scale(v * other.mass));
        other.vel = other.vel.add(l.scale(v * this.mass));
      }
    });
  }
}

class Ball extends CollisionObject {
  constructor(pos, name, radius, mass, vel, color) {
    super(pos, radius, mass, vel);
    this.name = name;
    this.color = color;
  }

  update(dt) {
    super.update(dt);

    if (mouseLeftJustPressed && mousePos.distance(this.pos) <= this.radius) {
      objects[cue].target = this;
    }

    this.vel = this.vel.scale(0.99);
  }

  draw(ctx, canvas) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(
      this.name,
      this.pos.x + this.radius + 10,
      this.pos.y - 15
    );
  }
}

class Cue extends Object {
  constructor(pos, sprite, target) {
    super(pos);
    this.sprite = sprite;
    this.target = target;
  }

  update(dt) {
    if (this.target && mouseLeftJustReleased) {
      //Vector to get from Stick to target
      const v = this.target.pos.subtract(mousePos);
      this.target.vel = v.normalize().scale(Math.min(1.1 ** v.length(), 500));

      this.target = null;
    }

    if (this.target) {
      this.pos = this.target.pos;
    }
  }

  draw(ctx, canvas) {
    if (!this.target) {
      return;
    }

    ctx.save();
    ctx.translate(this.target.pos.x, this.target.pos.y);

    let hit_vector = this.target.pos.subtract(mousePos);

    ctx.rotate(Math.atan2(hit_vector.x, -hit_vector.y));
    ctx.scale(1, 1);
    ctx.drawImage(
      this.sprite,
      -this.sprite.width / 2,
      Math.min(100, hit_vector.length())
    );
    ctx.restore();
  }
}
