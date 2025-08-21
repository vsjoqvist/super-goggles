class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static ZERO = new Vector2(0, 0);

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  scale(v) {
    return new Vector2(this.x * v, this.y * v);
  }

  normalize() {
    const length = this.length();
    if (length != 0) {
      return new Vector2(this.x / length, this.y / length);
    }

    return Vector2.ZERO;
  }

  distance(v) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  distance_squarred(v) {
    return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  length_squarred() {
    return this.x ** 2 + this.y ** 2;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  toText() {
    return `X: ${this.x}, Y: ${this.y}`;
  }
}

let mouseLeftPressed = false;
let mouseLeftJustPressed = false;
let mouseLeftJustReleased = false;
let mouseRightPressed = false;
let mouseRightJustPressed = false;
let mouseRightJustReleased = false;

let lastTime = performance.now();
let objects;
let collisionObjects;
let mousePos;
let wasMouseLeftPressed;
let wasMouseRightPressed;
let cue;

function init(ctx, canvas) {
  objects = [];
  collisionObjects = [];
  mousePos = Vector2.ZERO;

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  mouseCapture(canvas);
  collisionObjects.push(
    objects.push(
      new Ball(new Vector2(500, 500), "BBBBBOOOOB", 10, 100, Vector2.ZERO)
    ) - 1
  );

  collisionObjects.push(
    objects.push(
      new Ball(new Vector2(200, 200), "BANANNANAN", 10, 100, Vector2.ZERO)
    ) - 1
  );

  const img = new Image();
  img.src = "sprites/Cue.png";
  cue = objects.push(new Cue(Vector2.ZERO, img, null)) - 1;

  objects.forEach((object) => {
    object.init();
  });

  gameLoop(ctx, canvas);
}

function gameLoop(ctx, canvas) {
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000; // in seconds
  lastTime = currentTime;

  update(deltaTime); // use dt to scale movement

  draw(ctx, canvas);
  requestAnimationFrame(() => gameLoop(ctx, canvas)); //next frame
}

function update(dt) {
  if (!wasMouseLeftPressed && mouseLeftPressed) {
    mouseLeftJustPressed = true;
  } else {
    mouseLeftJustPressed = false;
  }

  if (wasMouseLeftPressed && !mouseLeftPressed) {
    mouseLeftJustReleased = true;
  } else {
    mouseLeftJustReleased = false;
  }

  if (!wasMouseRightPressed && mouseRightPressed) {
    mouseRightJustPressed = true;
  } else {
    mouseRightJustPressed = false;
  }

  if (wasMouseRightPressed && !mouseRightPressed) {
    mouseRightJustReleased = true;
  } else {
    mouseRightJustReleased = false;
  }

  if (mouseRightJustPressed) {
    collisionObjects.push(
      objects.push(
        new Ball(
          mousePos,
          coolnames[Math.floor(Math.random() * coolnames.length)],
          Math.max(Math.random() * 40, 3),
          Math.random() * 400,
          Vector2.ZERO,
          `rgb(
        ${Math.random() * 255}
        ${Math.random() * 255}
        ${Math.random() * 255}
        )`
        )
      ) - 1
    );
  }

  objects.forEach((object) => {
    object.update(dt);
  });

  wasMouseLeftPressed = mouseLeftPressed;
  wasMouseRightPressed = mouseRightPressed;
}

function draw(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach((object) => {
    object.draw(ctx, canvas);
  });
}

function mouseCapture(canvas) {
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect(); // canvas position & size
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    mousePos = new Vector2(mouseX, mouseY);
  });

  canvas.addEventListener("mousedown", (event) => {
    //Left click
    if (event.button == 0) {
      mouseLeftPressed = true;
    } else {
      mouseRightPressed = true;
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    //Left click
    if (event.button == 0) {
      mouseLeftPressed = false;
    } else {
      // rightclick
      mouseRightPressed = false;
    }
  });
}

let coolnames = [
  "MAMMMMMA MMIAAAAA",
  ";_;",
  "Tralalero Tralala",
  "Bombardiro Crocodilo",
  "Tung Tung Tung Tung Tung Tung Tung Tung Tung Sahur",
  "Lirilì Larilà",
  "Brr Brr Patapim",
  "Chimpanzini Bananini",
  "Bombombini Gusini",
  "Cappuccino Assassino",
  "Trippi Troppi",
  "La Vaca Saturno Saturnita",
  "Ballerina Cappuccina",
];
