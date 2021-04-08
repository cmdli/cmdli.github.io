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

class Rabbit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Wolf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
        console.log(x, y);
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
  topElement.appendChild(render(world));
})();
