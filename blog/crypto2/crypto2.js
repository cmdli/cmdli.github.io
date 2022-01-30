const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const alphanumeric = letters
  .concat(letters.map((letter) => letter.toLowerCase()))
  .concat(numbers);

class Function {
  constructor(id, func) {
    this.func = func;
    this.inputs_ = document.querySelectorAll("#" + id + " input");
    this.output = document.querySelector("#" + id + " #output");
    this.update();
    for (const input of this.inputs_) {
      input.oninput = () => {
        this.update();
      };
    }
  }

  update() {
    this.output.textContent = this.func(
      Array.from(this.inputs_).map((input) => input.value)
    );
  }
}

class Graph {
  constructor(id, func) {
    this.func = func;
    this.inputs = document.querySelectorAll("#" + id + " input");
    const graphContext = document.querySelector("#" + id + " canvas");
    this.graph = new Chart(graphContext, {
      type: "bar",
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
    if (this.title) {
      this.graph.options.plugins.title = {
        display: true,
        text: this.title,
        font: {
          size: 18,
          family:
            '"Century Gothic", "CenturyGothic", "AppleGothic", sans-serif',
        },
      };
    }
    this.update();
    for (const input of this.inputs.values()) {
      input.oninput = () => {
        input.value = input.value.toUpperCase();
        this.update();
      };
    }
  }

  update() {
    const inputValues = Array.from(this.inputs.values()).map(
      (input) => input.value
    );
    const frequencies = this.func(inputValues);
    const sortedFrequencies = Object.entries(frequencies).sort(
      (a, b) => a[0] - b[0]
    );
    this.graph.data = {
      labels: sortedFrequencies.map((a) => a[0]),
      datasets: [
        {
          label: "Frequency",
          data: sortedFrequencies.map((a) => a[1]),
          backgroundColor: ["rgba(47, 143, 255, 1.0)"],
          showLine: false,
        },
      ],
    };
    this.graph.update();
  }
}

function stringToUtf8Bytes(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str[i].charCodeAt(0);
  }
  return bytes;
}

function addBitFrequencies(frequencies, byte) {
  let i = 0;
  while (byte > 0) {
    if (byte & 0x1) {
      if (frequencies[i]) {
        frequencies[i] += 1;
      } else {
        frequencies[i] = 1;
      }
    }
    byte = byte >> 1;
    i++;
  }
}

function randomAlphanumericString(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * alphanumeric.length);
    str = str + alphanumeric[index];
  }
  return str;
}

function value1() {
  return 0x1;
}

function randomDecayByte(decay = 0.2) {
  let byte = 0;
  for (let j = 0; j < 8; j++) {
    let bit = 1;
    for (let k = 0; k < j + 1; k++) {
      if (Math.random() < decay) {
        bit = 0;
      }
    }
    byte = byte | (bit << j);
  }
  return byte;
}

function randomDecayBitString(length) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(randomDecayByte());
  }
  return bytes;
}

function byteString(length, func) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(func());
  }
  return bytes;
}

const MD2_SUB = [
  41, 46, 67, 201, 162, 216, 124, 1, 61, 54, 84, 161, 236, 240, 6, 19, 98, 167,
  5, 243, 192, 199, 115, 140, 152, 147, 43, 217, 188, 76, 130, 202, 30, 155, 87,
  60, 253, 212, 224, 22, 103, 66, 111, 24, 138, 23, 229, 18, 190, 78, 196, 214,
  218, 158, 222, 73, 160, 251, 245, 142, 187, 47, 238, 122, 169, 104, 121, 145,
  21, 178, 7, 63, 148, 194, 16, 137, 11, 34, 95, 33, 128, 127, 93, 154, 90, 144,
  50, 39, 53, 62, 204, 231, 191, 247, 151, 3, 255, 25, 48, 179, 72, 165, 181,
  209, 215, 94, 146, 42, 172, 86, 170, 198, 79, 184, 56, 210, 150, 164, 125,
  182, 118, 252, 107, 226, 156, 116, 4, 241, 69, 157, 112, 89, 100, 113, 135,
  32, 134, 91, 207, 101, 230, 45, 168, 2, 27, 96, 37, 173, 174, 176, 185, 246,
  28, 70, 97, 105, 52, 64, 126, 15, 85, 71, 163, 35, 221, 81, 175, 58, 195, 92,
  249, 206, 186, 197, 234, 38, 44, 83, 13, 110, 133, 40, 132, 9, 211, 223, 205,
  244, 65, 129, 77, 82, 106, 220, 55, 200, 108, 193, 171, 250, 36, 225, 123, 8,
  12, 189, 177, 74, 120, 136, 149, 139, 227, 99, 232, 109, 233, 203, 213, 254,
  59, 0, 29, 57, 242, 239, 183, 14, 102, 88, 208, 228, 166, 119, 114, 248, 235,
  117, 75, 10, 49, 68, 80, 180, 143, 237, 31, 26, 219, 153, 141, 51, 159, 17,
  131, 20,
];

function md2_checksum(bytes) {
  const checksum = new Uint8Array(16);
  checksum.fill(0);
  let carry = 0;
  for (let i = 0; i < bytes.length; i += 16) {
    for (let j = 0; j < 16; j++) {
      checksum[j] = MD2_SUB[bytes[i + j] ^ carry];
      carry = checksum[j];
    }
  }
  return checksum;
}

function md2(inputs) {
  const text = inputs[0];
  const textBytes = stringToUtf8Bytes(text);
  const paddingLength = 16 - (textBytes.length % 16);
  const bytes = new Uint8Array(textBytes.length + paddingLength);
  for (let i = textBytes.length; i < bytes.length; i++) {
    bytes[i] = paddingLength;
  }
  return bytes;
}

function xorHash(bytes) {
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = hash ^ bytes[i];
  }
  return hash;
}

function xorHashPlusSub(bytes) {
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = hash ^ MD2_SUB[bytes[i]];
  }
  return hash;
}

function longXorHash(bytes) {
  let hash = 0;
  for (let i = 0; i < bytes.length - 1; i += 2) {
    const twoByteValue = bytes[i] + (bytes[i + 1] << 8);
    hash = (hash ^ twoByteValue) & 0xffff;
  }
  return hash;
}

function addHash(bytes) {
  let hash = 0x16;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash + bytes[i]) & 0xff;
  }
  return hash;
}

function subOnly(bytes) {
  let hash = 0x16;
  for (let i = 0; i < bytes.length; i++) {
    hash = MD2_SUB[bytes[i]];
  }
  return hash;
}

function addAndXorHash(bytes) {
  let hash = 0;
  let adding = true;
  for (let i = 0; i < bytes.length; i++) {
    if (adding) {
      hash = (hash + bytes[i]) & 0xff;
    } else {
      hash = hash ^ bytes[i];
    }
    adding = !adding;
  }
  return hash;
}

function simpleABCDHash(input) {
  let a, b, c, d;
  a = b = c = d = 0;
  for (const byte of input) {
    const newVal = (a + b + c + d + byte) & 0xff;
    a = d;
    d = c;
    c = b;
    b = newVal;
  }
  return (a + (b << 8) + (c << 16) + (d << 24)) & 0x7fff;
}

function simpleABCDWithConstants(input) {
  let a, b, c, d;
  a = b = c = d = 0;
  let i = 0;
  for (const byte of input) {
    const newVal = (a + b + c + d + byte + T[i]) & 0xff;
    a = d;
    d = c;
    c = b;
    b = newVal;
    i = (i + 1) % 64;
  }
  return (a + (b << 8) + (c << 16) + (d << 24)) & 0x7fff;
}

function constantsTable() {
  let table = [];
  for (let i = 1; i <= 64; i++) {
    table.push(Math.floor(Math.abs(Math.sin(i)) * 0x100000000));
  }
  return table;
}

const T = constantsTable();

function basicHashFrequencies() {
  const frequencies = {};
  for (let i = 0; i < 10000; i++) {
    const hash = xorHash(randomDecayBitString(4, 0.2));
    addBitFrequencies(frequencies, hash);
  }
  return frequencies;
}

function longHashFrequencies() {
  const frequencies = {};
  for (let i = 0; i < 10000; i++) {
    const hash = subOnly(randomDecayBitString(4, 0.2));
    addBitFrequencies(frequencies, hash);
  }
  return frequencies;
}

function bitDecayFrequencies() {
  const frequencies = {};
  for (let i = 0; i < 1000; i++) {
    const byte = randomDecayBitString(1, 0.2)[0];
    addBitFrequencies(frequencies, byte);
  }
  return frequencies;
}

function simpleABCDHashFrequencies() {
  const frequencies = {};
  for (let i = 0; i < 1000; i++) {
    const hash = simpleABCDWithConstants(byteString(33, randomDecayByte));
    addBitFrequencies(frequencies, hash);
  }
  return frequencies;
}

(() => {
  console.log(T);
  new Graph("basic-hash", basicHashFrequencies);
  new Graph("bit-decay", bitDecayFrequencies);
  new Graph("long-xor-hash", longHashFrequencies);
  new Graph("simple-abcd-hash", simpleABCDHashFrequencies);
})();
