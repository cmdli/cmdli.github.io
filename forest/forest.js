"use strict";

const Cell = {
  GROUND: 1,
  TREE: 2,
  WATER: 3,
  FOOD: 4,
  RABBIT: 5,
  WOLF: 6,
};

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomCell() {
  return choose(Object.values(Cell));
}

function distance(loc1, loc2) {
  const d1 = loc1[0] - loc2[0];
  const d2 = loc1[1] - loc2[1];
  return Math.sqrt(d1 * d1 + d2 * d2);
}

class Animal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  loc() {
    return [this.x, this.y];
  }

  moveTowards(x, y) {
    if (x === this.x && y === this.y) {
      return;
    }
    let xDiff = x - this.x;
    let yDiff = y - this.y;
    if (xDiff * xDiff > yDiff * yDiff) {
      if (xDiff < 0) {
        this.x--;
      } else {
        this.x++;
      }
    } else {
      if (yDiff < 0) {
        this.y--;
      } else {
        this.y++;
      }
    }
  }
}

class Rabbit extends Animal {
  constructor(x, y) {
    super(x, y);
    this.food = 0;
    this.water = 0;
  }

  tick(world) {
    if (this.food === 0) {
      const foodTarget = world.findNearest(this.x, this.y, Cell.TREE);
      if (distance(foodTarget, this.loc()) < 2) {
        this.food++;
      } else {
        this.moveTowards(foodTarget[0], foodTarget[1]);
      }
    } else if (this.water === 0) {
      const waterTarget = world.findNearest(this.x, this.y, Cell.WATER);
      if (distance(waterTarget, this.loc()) < 2) {
        this.water++;
      } else {
        this.moveTowards(waterTarget[0], waterTarget[1]);
      }
    } else {
      world.addRabbit();
      this.food = 0;
      this.water = 0;
    }
  }
}

class Wolf extends Animal {
  constructor(x, y) {
    super(x, y);
    this.food = 10;
  }

  tick(world) {
    if (this.food > 50) {
      world.addWolf();
      this.food -= 25;
    } else if (this.food < 0) {
      world.removeWolf(this.loc());
    } else {
      const target = world.findNearest(this.x, this.y, Cell.RABBIT);
      if (distance(target, this.loc()) < 2) {
        world.removeRabbit(target);
        this.food += 5;
      } else {
        this.moveTowards(target[0], target[1]);
      }
    }
    this.food--;
  }
}

class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(Cell.GROUND);
      }
      this.cells.push(row);
    }
    this.wolves = [];
    this.rabbits = [];
  }
  get(x, y) {
    for (const wolf of this.wolves) {
      if (wolf.x === x && wolf.y === y) {
        return Cell.WOLF;
      }
    }
    for (const rabbit of this.rabbits) {
      if (rabbit.x === x && rabbit.y === y) {
        return Cell.RABBIT;
      }
    }
    return this.cells[y][x];
  }
  set(x, y, value) {
    this.cells[y][x] = value;
  }
  getCells() {
    const output = [];
    for (const row of this.cells) {
      const rowCopy = [];
      for (const cell of row) {
        rowCopy.push(cell);
      }
      output.push(rowCopy);
    }
    for (const wolf of this.wolves) {
      output[wolf.y][wolf.x] = Cell.WOLF;
    }
    for (const rabbit of this.rabbits) {
      output[rabbit.y][rabbit.x] = Cell.RABBIT;
    }
    return output;
  }
  addTree() {
    let x = Math.floor(Math.random() * this.width);
    let y = Math.floor(Math.random() * this.height);
    this.set(x, y, Cell.TREE);
  }

  addRiver() {
    let yStart = Math.floor(Math.random() * (this.height - 1));
    let yEnd = Math.floor(Math.random() * (this.height - 1));
    for (let x = 0; x < this.width; x++) {
      let y = Math.ceil(yStart + (yEnd - yStart) * (x / this.width));
      this.set(x, y, Cell.WATER);
      this.set(x, y + 1, Cell.WATER);
    }
  }

  addWolf() {
    // Try placing a wolf 10 times
    for (let i = 0; i < 10; i++) {
      let x = Math.floor(Math.random() * this.width);
      let y = Math.floor(Math.random() * this.height);
      if (this.get(x, y) === Cell.GROUND) {
        this.wolves.push(new Wolf(x, y));
        break;
      }
    }
  }

  addRabbit() {
    // Try placing a rabbit 10 times
    for (let i = 0; i < 10; i++) {
      let x = Math.floor(Math.random() * this.width);
      let y = Math.floor(Math.random() * this.height);
      if (this.get(x, y) === Cell.GROUND) {
        this.rabbits.push(new Rabbit(x, y));
        break;
      }
    }
  }

  removeRabbit(location) {
    for (let i = 0; i < this.rabbits.length; i++) {
      const rabbit = this.rabbits[i];
      if (rabbit.x === location[0] && rabbit.y === location[1]) {
        this.rabbits.splice(i, 1);
        break;
      }
    }
  }

  removeWolf(location) {
    for (let i = 0; i < this.wolves.length; i++) {
      const wolf = this.wolves[i];
      if (wolf.x === location[0] && wolf.y === location[1]) {
        this.wolves.splice(i, 1);
        break;
      }
    }
  }

  tick() {
    for (const rabbit of this.rabbits) {
      rabbit.tick(this);
    }
    for (const wolf of this.wolves) {
      wolf.tick(this);
    }
  }

  findNearest(x, y, target) {
    let minDist = this.width * this.height;
    let minLocation = [-1, -1];
    const cells = this.getCells();
    for (let y2 = 0; y2 < this.height; y2++) {
      for (let x2 = 0; x2 < this.width; x2++) {
        if (cells[y2][x2] === target) {
          const dist = distance([x, y], [x2, y2]);
          if (dist < minDist) {
            minDist = dist;
            minLocation = [x2, y2];
          }
        }
      }
    }
    return minLocation;
  }
}

function generateWorld(width, height) {
  const world = new World(width, height);
  for (let i = 0; i < 50; i++) {
    world.addTree();
  }
  world.addRiver();
  for (let i = 0; i < 10; i++) {
    world.addRabbit();
  }
  for (let i = 0; i < 3; i++) {
    world.addWolf();
  }
  return world;
}

function classForCell(cell) {
  switch (cell) {
    case Cell.GROUND:
      return "ground";
    case Cell.TREE:
      return "tree";
    case Cell.WATER:
      return "water";
    case Cell.FOOD:
      return "food";
    case Cell.RABBIT:
      return "rabbit";
    case Cell.WOLF:
      return "wolf";
  }
  return "";
}

function render(world) {
  const output = document.createElement("div");
  output.classList.add("world");
  for (const row of world.getCells()) {
    const rowRender = document.createElement("div");
    rowRender.classList.add("row");
    for (const cell of row) {
      const cellRender = document.createElement("div");
      cellRender.classList.add("cell", classForCell(cell));
      rowRender.appendChild(cellRender);
    }
    output.appendChild(rowRender);
  }
  return output;
}

(() => {
  const topElement = document.getElementById("forest");
  const world = generateWorld(50, 50);
  let oldChild = topElement.appendChild(render(world));
  setInterval(() => {
    world.tick();
    topElement.removeChild(oldChild);
    oldChild = render(world);
    topElement.appendChild(oldChild);
  }, 500);
})();
