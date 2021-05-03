"use strict";

class Function {
  constructor(id, func) {
    this.func = func;
    const topLevel = document.querySelector("#" + id);
    this.inputs = document.querySelectorAll("#" + id + " input");
    this.output = document.createElement("div");
    topLevel.appendChild(document.createTextNode("-->"));
    topLevel.appendChild(this.output);

    this.update();
    for (const input of this.inputs.values()) {
      input.oninput = () => {
        this.update();
      };
    }
  }

  update() {
    const inputValues = Array.from(this.inputs).map((input) => input.value);
    this.output.textContent = this.func(inputValues);
  }
}

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

function caesarCipher(inputs) {
  let output = "";
  const text = inputs[0];
  const shift = parseInt(inputs[1], 10);
  for (const letter of text) {
    const i = letters.indexOf(letter);
    if (i >= 0) {
      let nextI = i + shift < 0 ? i + shift + letters.length : i + shift;
      output += letters[nextI % letters.length];
    } else {
      output += letter;
    }
  }
  return output;
}

function caesarDecrypt(inputs) {
  let output = "";
  const text = inputs[0].toUpperCase();
  const shift = parseInt(inputs[1], 10);
  for (const letter of text) {
    const i = letters.indexOf(letter);
    if (i >= 0) {
      let nextI = i - shift < 0 ? i - shift + letters.length : i - shift;
      output += letters[nextI % letters.length];
    } else {
      output += letter;
    }
  }
  return output;
}

function vigenereEncrypt(inputs) {
  const text = inputs[0].toUpperCase();
  const cipherWord = inputs[1].toUpperCase();
  if (!cipherWord) {
    return text;
  }
  let cipher = "";
  while (cipher.length < text.length) {
    cipher += cipherWord;
  }
  cipher = cipher.substring(0, text.length);
  let output = "";
  for (let i = 0; i < text.length; i++) {
    let textI = letters.indexOf(text[i]);
    let cipherI = letters.indexOf(cipher[i]);
    if (textI >= 0 && cipherI >= 0) {
      const nextI = (textI + cipherI + letters.length) % letters.length;
      output += letters[nextI];
    } else {
      output += text[i];
    }
  }
  return output;
}

function vigenereDecrypt(inputs) {
  const text = inputs[0].toUpperCase();
  const cipherWord = inputs[1].toUpperCase();
  if (!cipherWord) {
    return text;
  }
  let cipher = "";
  while (cipher.length < text.length) {
    cipher += cipherWord;
  }
  cipher = cipher.substring(0, text.length);
  let output = "";
  for (let i = 0; i < text.length; i++) {
    let textI = letters.indexOf(text[i]);
    let cipherI = letters.indexOf(cipher[i]);
    if (textI >= 0 && cipherI >= 0) {
      const nextI = (textI - cipherI + letters.length) % letters.length;
      output += letters[nextI];
    } else {
      output += text[i];
    }
  }
  return output;
}

function vigenereShiftEncrypt(inputs) {
  const text = inputs[0].toUpperCase();
  const cipherWord = inputs[1].toUpperCase();
  const shift = parseInt(inputs[2]);
  if (!cipherWord) {
    return text;
  }
  const firstPass = vigenereEncrypt([text, cipherWord]);
  const shifted =
    firstPass.substring(firstPass.length - shift) +
    firstPass.substring(0, firstPass.length - shift);
  return vigenereEncrypt([shifted, cipherWord]);
}

function vigenereShiftDecrypt(inputs) {
  const text = inputs[0].toUpperCase();
  const cipherWord = inputs[1].toUpperCase();
  const shift = parseInt(inputs[2]);
  if (!cipherWord) {
    return text;
  }
  const firstPass = vigenereDecrypt([text, cipherWord]);
  const shifted = firstPass.substring(shift) + firstPass.substring(0, shift);
  return vigenereDecrypt([shifted, cipherWord]);
}

(() => {
  new Function("caesar", caesarCipher);
  new Function("caesar-decrypt", caesarDecrypt);
  new Function("vigenere-encrypt", vigenereEncrypt);
  new Function("vigenere-decrypt", vigenereDecrypt);
  new Function("vigenere-shift-encrypt", vigenereShiftEncrypt);
  new Function("vigenere-shift-decrypt", vigenereShiftDecrypt);
})();
