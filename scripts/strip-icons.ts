import fs from "fs";

const iconsFile = fs.readFileSync("public/icons.svg", { encoding: "utf-8" });
const lines = iconsFile.split("\n").map((l) => l.trim());

// i = 1 to skip the svg tag
let i = 1;
// length - 1 to skip the svg close tag
while (i < lines.length - 1) {
  const idIndex = lines[i].indexOf("id") + 4;
  const id = lines[i].substring(idIndex, lines[i].indexOf('"', idIndex));

  const svgLines: string[] = [];
  i++; // Move to the next line
  while (!lines[i].startsWith("</symbol")) {
    svgLines.push(lines[i]);
    i++; // Move to the next line, could be </symbol>
  }

  // lines[i] should be </symbol> now.

  // TODO: dynamic viewbox
  const svgTag =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200">';
  fs.writeFileSync(
    `scripts/${id}.svg`,
    `${svgTag}\n${svgLines.join("\n")}\n</svg>`,
    {
      encoding: "utf-8",
    }
  );

  i++; // Move to the next line, should be <symbol...> now.
}
