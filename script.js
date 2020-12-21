const canvas = document.getElementById("canvas");
const divFigures = document.getElementById("figures");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let mouse = {
  x: 0,
  y: 0,
  down: false,
};

function Circle(x, y, r, fill, stroke) {
  this.startAngle = 0;
  this.endAngle = 2 * Math.PI;
  this.x = x;
  this.y = y;
  this.r = r;
  this.selected = false;

  this.fill = fill;
  this.stroke = this.selected ? "yellow" : "black";
  ctx.lineWidth = this.selected ? 2 : 1;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, this.startAngle, this.endAngle);
    ctx.fillStyle = this.fill;

    ctx.fill();
    ctx.strokeStyle = this.stroke;
    ctx.stroke();

    requestAnimationFrame(this.draw.bind(this));
  };

  this.select = function () {
    this.selected = !this.selected;
    this.stroke = "yellow";
    ctx.lineWidth = 2;
    this.draw();
  };

  this.unselect = function () {
    this.stroke = "black";
    ctx.lineWidth = 1;
    this.draw();
  };
}

function isCursorInCircle(x, y, circle) {
  console.log(
    x > circle.x + 200 - circle.r &&
      x < circle.x + circle.r + 200 &&
      y > circle.y + 25 &&
      y < circle.y + circle.r + 25
  );
  console.log(
    x,
    circle.x + 200 - circle.r,
    circle.x + circle.r + 200,
    y,
    circle.y + 25,
    circle.y + circle.r + 25
  );
  return (
    x > circle.x + 200 - circle.r &&
    x < circle.x + circle.r + 200 &&
    y > circle.y + 25 &&
    y < circle.y + circle.r + 25
  );
}

(function dragDrop() {
  let coordX;
  let coordY;

  const dragElCircle = document.querySelector(".circle");
  dragElCircle.draggable = true;

  // const dragElSquare = document.getElementById("square");
  // dragElSquare.draggable = true;

  dragElCircle.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/html", "dragstart");
    coordX = e.clientX + e.offsetX;
    coordY = e.clientY;
  });

  canvas.addEventListener("dragover", (e) => {
    e.dataTransfer.effectAllowed = "copyMove";
    e.preventDefault();
  });

  let circles = [];

  function updateView(e) {
    var x = e.clientX;
    var y = e.clientY;
    circles.push(new Circle(x - coordX, y, 50, "blue", "black"));

    for (let i in circles) {
      circles[i].draw();
    }
  }

  canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    updateView(e);
  });

  canvas.onmousedown = function (e) {
    mouse.down = true;

    for (let i in circles) {
      if (isCursorInCircle(mouse.x, mouse.y, circles[i])) {
        let el = circles[i];
        circles.shift(el);
        circles.push(el);

        circles[i].draw();
        circles[i].select();
        circles[i].selected = true;
      }
      if (!isCursorInCircle(mouse.x, mouse.y, circles[i])) {
        circles[i].unselect();
        circles[i].selected = false;
      }
    }

    canvas.onmousemove = function (e) {
      mouse.x = e.pageX;
      mouse.y = e.pageY;

      for (let i in circles) {
        if (mouse.down == true) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (let i in circles) {
            if (circles[i].selected) {
              circles[i].x = mouse.x - 200;
              circles[i].y = mouse.y;
            }
          }
        }
      }
    };

    canvas.onmouseup = function (e) {
      mouse.down = false;

      for (let i in circles) {
        if (circles[i].selected) {
          circles[i].selected = false;
        }
      }
    };
  };
})();
