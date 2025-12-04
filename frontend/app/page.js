"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { AiOutlineStepForward } from "react-icons/ai";

import "./board.css";

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function createVisitedBoard(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

// Normal Picross 15x20 (mismo puzzle que el notebook)
const NORMAL_ROW_CLUES = [
  [1],
  [1],
  [1, 2],
  [2, 3, 4],
  [4, 3],
  [6, 3, 2],
  [5],
  [1, 3, 1],
  [2, 1, 5, 1],
  [1, 5, 7],
  [2, 4, 8],
  [6, 1, 4, 4],
  [3, 2, 1, 4, 3],
  [4, 4, 8],
  [20],
];

const NORMAL_COL_CLUES = [
  [2, 1, 1],
  [3, 1, 2],
  [2, 4],
  [2, 6],
  [1, 5],
  [1, 1, 1],
  [1, 6],
  [8],
  [2, 2],
  [6],
  [1, 2, 1],
  [6, 5],
  [15],
  [12],
  [1, 7],
  [1, 2, 2],
  [1, 6],
  [1, 8],
  [2, 1, 6],
  [1, 1, 1, 1],
];

function generateBinaryLinePatterns(length, clues) {
  if (!clues.length) {
    return [new Array(length).fill(0)];
  }

  const patterns = [];

  function backtrack(pos, clueIdx, currentPattern) {
    if (clueIdx === clues.length) {
      const tail = new Array(length - pos).fill(0);
      patterns.push([...currentPattern, ...tail]);
      return;
    }

    const clue = clues[clueIdx];
    let minSpaceNeeded = 0;
    for (let i = clueIdx; i < clues.length; i += 1) {
      minSpaceNeeded += clues[i];
    }
    const gaps = clues.length - clueIdx - 1;
    minSpaceNeeded += gaps;

    for (let start = pos; start <= length - minSpaceNeeded; start += 1) {
      const zerosBefore = start - pos;
      let newPattern = currentPattern;
      if (zerosBefore > 0) {
        newPattern = newPattern.concat(new Array(zerosBefore).fill(0));
      }
      newPattern = newPattern.concat(new Array(clue).fill(1));

      if (clueIdx < clues.length - 1) {
        backtrack(start + clue + 1, clueIdx + 1, newPattern.concat(0));
      } else {
        backtrack(start + clue, clueIdx + 1, newPattern);
      }
    }
  }

  backtrack(0, 0, []);
  return patterns;
}

function solveNormalPicross(rowClues, colClues, options = {}) {
  const { collectTrace = false, maxTraceLength = 20000 } = options;

  const nRows = rowClues.length;
  const nCols = colClues.length;

  const rowPatterns = rowClues.map((clue) =>
    generateBinaryLinePatterns(nCols, clue)
  );
  const colPatterns = colClues.map((clue) =>
    generateBinaryLinePatterns(nRows, clue)
  );

  const possibleCols = colPatterns.map((patterns) => patterns.slice());
  const solutionRows = new Array(nRows);

  const trace = collectTrace ? [] : null;
  let traceTruncated = false;

  function record(row, col, value) {
    if (!trace || traceTruncated) return;
    if (trace.length >= maxTraceLength) {
      traceTruncated = true;
      return;
    }
    trace.push({ row, col, value });
  }

  function writeRow(rowIndex, pattern) {
    for (let c = 0; c < nCols; c += 1) {
      record(rowIndex, c, pattern[c]);
    }
  }

  function clearRow(rowIndex) {
    for (let c = 0; c < nCols; c += 1) {
      record(rowIndex, c, -1);
    }
  }

  function search(rowIndex, currentPossibleCols) {
    if (rowIndex === nRows) {
      return true;
    }

    const candidates = rowPatterns[rowIndex];
    for (let p = 0; p < candidates.length; p += 1) {
      const pattern = candidates[p];
      const nextPossibleCols = new Array(nCols);
      let ok = true;

      for (let c = 0; c < nCols; c += 1) {
        const val = pattern[c];
        const colOptions = currentPossibleCols[c];
        const filtered = [];
        for (let k = 0; k < colOptions.length; k += 1) {
          const colPat = colOptions[k];
          if (colPat[rowIndex] === val) {
            filtered.push(colPat);
          }
        }
        if (filtered.length === 0) {
          ok = false;
          break;
        }
        nextPossibleCols[c] = filtered;
      }

      if (!ok) continue;

      solutionRows[rowIndex] = pattern;
      writeRow(rowIndex, pattern);
      if (search(rowIndex + 1, nextPossibleCols)) {
        return true;
      }
      clearRow(rowIndex);
    }

    return false;
  }

  const success = search(0, possibleCols);
  if (!success) return null;
  if (!trace) return solutionRows;

  if (traceTruncated) {
    for (let r = 0; r < nRows; r += 1) {
      for (let c = 0; c < nCols; c += 1) {
        trace.push({ row: r, col: c, value: -1 });
      }
    }
    for (let r = 0; r < nRows; r += 1) {
      for (let c = 0; c < nCols; c += 1) {
        const v = solutionRows[r][c];
        trace.push({ row: r, col: c, value: v });
      }
    }
  }

  return { solution: solutionRows, trace };
}

// Color Picross 15x15 (mismo puzzle que antes)
const COLOR_PALETTE = {
  1: "#4169E1", // blue
  2: "#FFD700", // yellow
  3: "#8B4513", // brown
  4: "#FFFACD", // cream
};

const COLOR_ROW_CLUES = [
  [[4, 1]],
  [[6, 1]],
  [[8, 1]],
  [
    [2, 4],
    [2, 1],
    [3, 4],
    [1, 1],
  ],
  [
    [1, 4],
    [1, 1],
    [2, 2],
    [1, 4],
    [1, 1],
    [1, 4],
    [1, 1],
  ],
  [
    [1, 3],
    [4, 2],
    [2, 3],
    [1, 1],
  ],
  [
    [5, 3],
    [2, 1],
  ],
  [
    [6, 4],
    [3, 1],
  ],
  [
    [1, 1],
    [6, 4],
    [4, 1],
  ],
  [
    [2, 1],
    [6, 4],
    [5, 1],
  ],
  [
    [3, 1],
    [1, 3],
    [4, 4],
    [1, 3],
    [2, 1],
    [3, 1],
  ],
  [
    [7, 3],
    [2, 1],
  ],
  [
    [7, 3],
    [4, 1],
  ],
  [
    [2, 3],
    [4, 3],
    [2, 1],
  ],
  [
    [1, 2],
    [1, 1],
    [1, 2],
    [1, 2],
    [1, 1],
    [1, 2],
  ],
];

const COLOR_COL_CLUES = [
  [[1, 1]],
  [[2, 1]],
  [[3, 1]],
  [
    [1, 1],
    [2, 4],
    [1, 3],
    [3, 4],
    [3, 3],
    [1, 2],
  ],
  [
    [2, 1],
    [1, 4],
    [1, 1],
    [1, 2],
    [1, 3],
    [4, 4],
    [3, 3],
    [1, 1],
  ],
  [
    [4, 1],
    [2, 2],
    [1, 3],
    [4, 4],
    [3, 3],
    [1, 2],
  ],
  [
    [4, 1],
    [2, 2],
    [1, 3],
    [4, 4],
    [2, 3],
  ],
  [
    [3, 1],
    [2, 4],
    [1, 2],
    [1, 3],
    [4, 4],
    [3, 3],
  ],
  [
    [3, 1],
    [1, 4],
    [1, 1],
    [2, 3],
    [3, 4],
    [4, 3],
    [1, 2],
  ],
  [
    [2, 1],
    [2, 4],
    [1, 3],
    [5, 1],
    [3, 3],
    [1, 1],
  ],
  [
    [11, 1],
    [1, 3],
    [1, 2],
  ],
  [
    [3, 1],
    [3, 1],
  ],
  [
    [3, 1],
    [2, 1],
  ],
  [
    [2, 1],
    [1, 1],
  ],
  [[1, 1]],
];

function generateColorLinePatterns(length, colorClues) {
  if (!colorClues.length) {
    return [new Array(length).fill(0)];
  }

  const patterns = [];

  function backtrack(pos, clueIdx, currentPattern) {
    if (clueIdx === colorClues.length) {
      const tail = new Array(length - pos).fill(0);
      patterns.push([...currentPattern, ...tail]);
      return;
    }

    const [count, color] = colorClues[clueIdx];

    let minSpaceNeeded = 0;
    for (let i = clueIdx; i < colorClues.length; i += 1) {
      minSpaceNeeded += colorClues[i][0];
    }

    let gapsNeeded = 0;
    for (let i = clueIdx + 1; i < colorClues.length; i += 1) {
      if (colorClues[i - 1][1] === colorClues[i][1]) {
        gapsNeeded += 1;
      }
    }

    const maxStart = length - minSpaceNeeded - gapsNeeded;

    for (let start = pos; start <= maxStart; start += 1) {
      const zerosBefore = start - pos;
      let newPattern = currentPattern;
      if (zerosBefore > 0) {
        newPattern = newPattern.concat(new Array(zerosBefore).fill(0));
      }
      newPattern = newPattern.concat(new Array(count).fill(color));

      if (clueIdx < colorClues.length - 1) {
        const nextColor = colorClues[clueIdx + 1][1];
        if (color === nextColor) {
          backtrack(
            start + count + 1,
            clueIdx + 1,
            newPattern.concat(0)
          );
        } else {
          backtrack(start + count, clueIdx + 1, newPattern);
          backtrack(
            start + count + 1,
            clueIdx + 1,
            newPattern.concat(0)
          );
        }
      } else {
        backtrack(start + count, clueIdx + 1, newPattern);
      }
    }
  }

  backtrack(0, 0, []);
  return patterns;
}

function solveColorPicross(rowClues, colClues, options = {}) {
  const { collectTrace = false, maxTraceLength = 20000 } = options;

  const nRows = rowClues.length;
  const nCols = colClues.length;

  const rowPatterns = rowClues.map((clue) =>
    generateColorLinePatterns(nCols, clue)
  );
  const colPatterns = colClues.map((clue) =>
    generateColorLinePatterns(nRows, clue)
  );

  const possibleCols = colPatterns.map((patterns) => patterns.slice());
  const solutionRows = new Array(nRows);

  const trace = collectTrace ? [] : null;
  let traceTruncated = false;

  function record(row, col, value) {
    if (!trace || traceTruncated) return;
    if (trace.length >= maxTraceLength) {
      traceTruncated = true;
      return;
    }
    trace.push({ row, col, value });
  }

  function writeRow(rowIndex, pattern) {
    for (let c = 0; c < nCols; c += 1) {
      record(rowIndex, c, pattern[c]);
    }
  }

  function clearRow(rowIndex) {
    for (let c = 0; c < nCols; c += 1) {
      record(rowIndex, c, -1);
    }
  }

  function search(rowIndex, currentPossibleCols) {
    if (rowIndex === nRows) {
      return true;
    }

    const candidates = rowPatterns[rowIndex];
    for (let p = 0; p < candidates.length; p += 1) {
      const pattern = candidates[p];
      const nextPossibleCols = new Array(nCols);
      let ok = true;

      for (let c = 0; c < nCols; c += 1) {
        const val = pattern[c];
        const colOptions = currentPossibleCols[c];
        const filtered = [];
        for (let k = 0; k < colOptions.length; k += 1) {
          const colPat = colOptions[k];
          if (colPat[rowIndex] === val) {
            filtered.push(colPat);
          }
        }
        if (filtered.length === 0) {
          ok = false;
          break;
        }
        nextPossibleCols[c] = filtered;
      }

      if (!ok) continue;

      solutionRows[rowIndex] = pattern;
      writeRow(rowIndex, pattern);
      if (search(rowIndex + 1, nextPossibleCols)) {
        return true;
      }
      clearRow(rowIndex);
    }

    return false;
  }

  const success = search(0, possibleCols);
  if (!success) return null;
  if (!trace) return solutionRows;
  return { solution: solutionRows, trace };
}

function buildColorSolutionFromClues() {
  const result = solveColorPicross(COLOR_ROW_CLUES, COLOR_COL_CLUES, {
    collectTrace: true,
    maxTraceLength: 20000,
  });
  if (!result) {
    return {
      solution: createEmptyBoard(15, 15),
      trace: [],
    };
  }

  const { solution, trace } = result;
  return {
    solution: solution.map((row) => row.slice()),
    trace,
  };
}

// Mega Picross 5x5
const MEGA5_ROW_CLUES = [
  [0],
  [3],
  [[6, "-M"]],
  [[6, "-M"]],
  [5],
];

const MEGA5_COL_CLUES = [
  [[5, "-M"]],
  [[5, "-M"]],
  [4],
  [4],
  [1],
];

function generateMegaPatterns(lineLength, clueValue) {
  if (clueValue === 0) {
    return [new Array(2 * lineLength).fill(0)];
  }

  const patterns = [];

  function isConnected(cells) {
    if (!cells.length) return true;

    const visited = new Set();
    const stack = [cells[0]];

    while (stack.length) {
      const pos = stack.pop();
      if (visited.has(pos)) continue;
      visited.add(pos);

      const row = pos < lineLength ? 0 : 1;
      const col = pos % lineLength;

      const neighbors = [];
      if (col > 0) neighbors.push(pos - 1);
      if (col < lineLength - 1) neighbors.push(pos + 1);
      if (row === 0) neighbors.push(pos + lineLength);
      else neighbors.push(pos - lineLength);

      for (let i = 0; i < neighbors.length; i += 1) {
        const nPos = neighbors[i];
        if (cells.includes(nPos) && !visited.has(nPos)) {
          stack.push(nPos);
        }
      }
    }

    return visited.size === cells.length;
  }

  function backtrack(start, chosen) {
    if (chosen.length === clueValue) {
      if (!isConnected(chosen)) return;
      const pattern = new Array(2 * lineLength).fill(0);
      for (let i = 0; i < chosen.length; i += 1) {
        pattern[chosen[i]] = 1;
      }
      patterns.push(pattern);
      return;
    }

    const remaining = clueValue - chosen.length;
    for (let i = start; i <= 2 * lineLength - remaining; i += 1) {
      chosen.push(i);
      backtrack(i + 1, chosen);
      chosen.pop();
    }
  }

  backtrack(0, []);
  return patterns;
}

function solveMegaPicross5x5(options = {}) {
  const { collectTrace = false, maxTraceLength = 20000 } = options;

  const nRows = 5;
  const nCols = 5;

  const trace = collectTrace ? [] : null;
  let traceTruncated = false;

  const solutionRows = new Array(nRows);

  function record(row, col, value) {
    if (!trace || traceTruncated) return;
    if (trace.length >= maxTraceLength) {
      traceTruncated = true;
      return;
    }
    trace.push({ row, col, value });
  }

  function writeRow(rowIndex, pattern) {
    for (let c = 0; c < nCols; c += 1) {
      record(rowIndex, c, pattern[c]);
    }
  }

  function clearRow(rowIndex) {
    for (let c = 0; c < nCols; c += 1) {
      record(rowIndex, c, -1);
    }
  }

  const row0Patterns = generateBinaryLinePatterns(nCols, MEGA5_ROW_CLUES[0]);
  const row1Patterns = generateBinaryLinePatterns(nCols, MEGA5_ROW_CLUES[1]);
  const row4Patterns = generateBinaryLinePatterns(nCols, MEGA5_ROW_CLUES[4]);
  const rowPair23Patterns = generateMegaPatterns(nCols, 6);

  const col2Patterns = generateBinaryLinePatterns(nRows, MEGA5_COL_CLUES[2]);
  const col3Patterns = generateBinaryLinePatterns(nRows, MEGA5_COL_CLUES[3]);
  const col4Patterns = generateBinaryLinePatterns(nRows, MEGA5_COL_CLUES[4]);
  const colPair01Patterns = generateMegaPatterns(nRows, 5);

  const col2Set = new Set(col2Patterns.map((p) => p.join("")));
  const col3Set = new Set(col3Patterns.map((p) => p.join("")));
  const col4Set = new Set(col4Patterns.map((p) => p.join("")));
  const colPair01Set = new Set(colPair01Patterns.map((p) => p.join("")));

  function checkColumns() {
    for (let i = 0; i < nRows; i += 1) {
      if (!solutionRows[i]) return false;
    }

    const col0 = [];
    const col1 = [];
    const col2 = [];
    const col3 = [];
    const col4 = [];

    for (let r = 0; r < nRows; r += 1) {
      col0.push(solutionRows[r][0]);
      col1.push(solutionRows[r][1]);
      col2.push(solutionRows[r][2]);
      col3.push(solutionRows[r][3]);
      col4.push(solutionRows[r][4]);
    }

    if (!col2Set.has(col2.join(""))) return false;
    if (!col3Set.has(col3.join(""))) return false;
    if (!col4Set.has(col4.join(""))) return false;

    const pair01Key = col0.concat(col1).join("");
    if (!colPair01Set.has(pair01Key)) return false;

    return true;
  }

  let found = false;

  function search(rowIndex) {
    if (found) return true;

    if (rowIndex >= nRows) {
      if (checkColumns()) {
        found = true;
        return true;
      }
      return false;
    }

    if (rowIndex === 0) {
      for (let i = 0; i < row0Patterns.length; i += 1) {
        const pattern = row0Patterns[i];
        solutionRows[0] = pattern;
        writeRow(0, pattern);
        if (search(1)) return true;
        clearRow(0);
        solutionRows[0] = null;
      }
      return false;
    }

    if (rowIndex === 1) {
      for (let i = 0; i < row1Patterns.length; i += 1) {
        const pattern = row1Patterns[i];
        solutionRows[1] = pattern;
        writeRow(1, pattern);
        if (search(2)) return true;
        clearRow(1);
        solutionRows[1] = null;
      }
      return false;
    }

    if (rowIndex === 2) {
      for (let i = 0; i < rowPair23Patterns.length; i += 1) {
        const pair = rowPair23Patterns[i];
        const row2 = pair.slice(0, nCols);
        const row3 = pair.slice(nCols);
        solutionRows[2] = row2;
        solutionRows[3] = row3;
        writeRow(2, row2);
        writeRow(3, row3);
        if (search(4)) return true;
        clearRow(2);
        clearRow(3);
        solutionRows[2] = null;
        solutionRows[3] = null;
      }
      return false;
    }

    if (rowIndex === 3) {
      return search(4);
    }

    if (rowIndex === 4) {
      for (let i = 0; i < row4Patterns.length; i += 1) {
        const pattern = row4Patterns[i];
        solutionRows[4] = pattern;
        writeRow(4, pattern);
        if (search(5)) return true;
        clearRow(4);
        solutionRows[4] = null;
      }
      return false;
    }

    return false;
  }

  search(0);

  if (!found) return null;

  const solution = solutionRows.map((row) => row.slice());
  if (!trace) return solution;
  return { solution, trace };
}

function buildSteps(solution) {
  const steps = [];
  const rows = solution.length;
  const cols = solution[0].length;
  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const cellValue = solution[i][j];
      steps.push({ row: i, col: j, value: cellValue });
    }
  }
  return steps.sort((a, b) => a.col - b.col || a.row - b.row);
}

function Board({ board, rowClues, colClues, activeCell, isColorMode, visited }) {
  const rows = board.length;
  const cols = board[0].length;
  const CELL_SIZE = 24;

  return (
    <div className="board-root">
      <div className="board-matrix">
        <div />

        <div className="board-col-clues">
          {colClues.map((clue, j) => {
            const display =
              isColorMode && clue.length
                ? clue
                : clue.length === 1 && clue[0] === 0
                ? []
                : clue;

            return (
              <div key={j} className="board-col-clue">
                {display.map((item, idx) => {
                  if (isColorMode) {
                    const [count, colorVal] = item;
                    const bg = COLOR_PALETTE[colorVal] || "#e5e7eb";
                    const textColor =
                      colorVal === 1 || colorVal === 3 ? "#ffffff" : "#111827";
                    return (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: bg,
                          color: textColor,
                        }}
                      >
                        {count}
                      </span>
                    );
                  }

                  return <span key={idx}>{item}</span>;
                })}
              </div>
            );
          })}
        </div>

        <div className="board-row-clues">
          {rowClues.map((clue, i) => {
            const display =
              isColorMode && clue.length
                ? clue
                : clue.length === 1 && clue[0] === 0
                ? []
                : clue;

            return (
              <div key={i} className="board-row-clue">
                {display.map((item, idx) => {
                  if (isColorMode) {
                    const [count, colorVal] = item;
                    const bg = COLOR_PALETTE[colorVal] || "#e5e7eb";
                    const textColor =
                      colorVal === 1 || colorVal === 3 ? "#ffffff" : "#111827";
                    return (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: bg,
                          color: textColor,
                        }}
                      >
                        {count}
                      </span>
                    );
                  }

                  return <span key={idx}>{item}</span>;
                })}
              </div>
            );
          })}
        </div>

        <div className="board-wrapper">
          <div
            className="board-grid"
            style={{ gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)` }}
          >
            {board.map((row, i) =>
              row.map((value, j) => {
                const isActive =
                  activeCell && activeCell.row === i && activeCell.col === j;
                const cellValue = value;
                const isFilled = isColorMode ? cellValue !== 0 : cellValue === 1;
                const hasX = visited?.[i]?.[j];

                const classNames = ["board-cell"];
                if (isColorMode) {
                  classNames.push("board-cell--color");
                } else {
                  classNames.push(
                    isFilled ? "board-cell--filled" : "board-cell--empty"
                  );
                }
                if (isActive) classNames.push("board-cell--active");

                const cellStyle = {};
                if (isColorMode) {
                  if (cellValue !== 0) {
                    cellStyle.backgroundColor =
                      COLOR_PALETTE[cellValue] || "#9ca3af";
                  } else {
                    cellStyle.backgroundColor = "#f3f4f6";
                  }
                }

                return (
                  <motion.div
                    key={`${i}-${j}`}
                    className={classNames.join(" ")}
                    style={cellStyle}
                    animate={{
                      scale: isActive ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {hasX && <span className="board-cell__x">x</span>}
                  </motion.div>
                );
              })
            )}
          </div>

          <div
            className="board-crosshair board-crosshair--h"
            style={{
              top:
                activeCell != null
                  ? (activeCell.row + 0.5) * CELL_SIZE
                  : (rows / 2) * CELL_SIZE,
            }}
          />
          <div
            className="board-crosshair board-crosshair--v"
            style={{
              left:
                activeCell != null
                  ? (activeCell.col + 0.5) * CELL_SIZE
                  : (cols / 2) * CELL_SIZE,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HUD({ elapsed, currentStep, totalSteps, mode }) {
  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  const title =
    mode === "color"
      ? "COLOR PICROSS"
      : mode === "mega"
      ? "MEGA PICROSS"
      : "PICROSS";
  const modeLabel =
    mode === "color" ? "COLOR" : mode === "mega" ? "MEGA" : "NORMAL";

  return (
    <div className="hud">
      <div className="hud-title">{title}</div>
      <div className="hud-mode">{modeLabel}</div>
      <div className="hud-progress">
        1P {currentStep}/{totalSteps}
      </div>
      <div className="hud-timer">
        {minutes}:{seconds}
      </div>
    </div>
  );
}

function ControlsBar({
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
}) {
  return (
    <div className="controls-bar">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={isPlaying ? onPause : onPlay}
        className={
          "controls-button " +
          (isPlaying ? "" : "controls-button--primary")
        }
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            Pausar
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Reproducir
          </>
        )}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStep}
        className="controls-button"
      >
        <AiOutlineStepForward className="w-4 h-4" />
        Paso +1
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="controls-button"
      >
        <RotateCcw className="w-4 h-4" />
        Reiniciar
      </motion.button>

      <div className="controls-speed">
        <span>{(1000 / speed).toFixed(1)} c/s</span>
        <input
          type="range"
          min={2}
          max={2000}
          step={10}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState("normal");

  const { solution, rowClues, colClues, steps, isColorMode } = useMemo(() => {
    if (mode === "color") {
      const { solution: colorSolution, trace } = buildColorSolutionFromClues();
      const stepsArray = trace && trace.length ? trace : buildSteps(colorSolution);

      return {
        solution: colorSolution,
        rowClues: COLOR_ROW_CLUES,
        colClues: COLOR_COL_CLUES,
        steps: stepsArray,
        isColorMode: true,
      };
    }

    if (mode === "mega") {
      const result = solveMegaPicross5x5({
        collectTrace: true,
        maxTraceLength: 20000,
      });

      let baseSolution;
      let stepsArray;

      if (result && result.solution && result.trace) {
        baseSolution = result.solution;
        stepsArray = result.trace;
      } else if (Array.isArray(result)) {
        baseSolution = result;
        stepsArray = buildSteps(baseSolution);
      } else {
        baseSolution = createEmptyBoard(5, 5);
        stepsArray = [];
      }

      return {
        solution: baseSolution,
        rowClues: MEGA5_ROW_CLUES,
        colClues: MEGA5_COL_CLUES,
        steps: stepsArray,
        isColorMode: false,
      };
    }

    const result = solveNormalPicross(NORMAL_ROW_CLUES, NORMAL_COL_CLUES, {
      collectTrace: true,
      maxTraceLength: 20000,
    });

    let baseSolution;
    let stepsArray;

    if (result && result.solution && result.trace) {
      baseSolution = result.solution;
      stepsArray = result.trace;
    } else if (Array.isArray(result)) {
      baseSolution = result;
      stepsArray = buildSteps(baseSolution);
    } else {
      baseSolution = createEmptyBoard(
        NORMAL_ROW_CLUES.length,
        NORMAL_COL_CLUES.length
      );
      stepsArray = [];
    }

    return {
      solution: baseSolution,
      rowClues: NORMAL_ROW_CLUES,
      colClues: NORMAL_COL_CLUES,
      steps: stepsArray,
      isColorMode: false,
    };
  }, [mode]);

  const [board, setBoard] = useState(() =>
    createEmptyBoard(solution.length, solution[0].length)
  );
  const [visited, setVisited] = useState(() =>
    createVisitedBoard(solution.length, solution[0].length)
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [activeCell, setActiveCell] = useState(null);

  useEffect(() => {
    setBoard(createEmptyBoard(solution.length, solution[0].length));
    setVisited(createVisitedBoard(solution.length, solution[0].length));
    setCurrentStep(0);
    setElapsed(0);
    setActiveCell(null);
    setIsPlaying(false);
  }, [mode, solution.length, solution[0].length]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length) {
      setIsPlaying(false);
      return;
    }

    const timeout = setTimeout(() => {
      const step = steps[currentStep];
      setBoard((prev) => {
        const next = prev.map((row) => row.slice());
        const value = step.value;
        if (value === -1) {
          next[step.row][step.col] = 0;
        } else if (value > 0) {
          next[step.row][step.col] = value;
        } else {
          next[step.row][step.col] = 0;
        }
        return next;
      });
      setVisited((prev) => {
        const next = prev.map((row) => row.slice());
        const value = step.value;
        if (value === 0) {
          next[step.row][step.col] = true;
        } else {
          next[step.row][step.col] = false;
        }
        return next;
      });
      setActiveCell({ row: step.row, col: step.col });
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, speed, steps]);

  const handlePlay = () => {
    if (currentStep >= steps.length) return;
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (currentStep >= steps.length) return;
    const step = steps[currentStep];
    setBoard((prev) => {
      const next = prev.map((row) => row.slice());
      const value = step.value;
      if (value === -1) {
        next[step.row][step.col] = 0;
      } else if (value > 0) {
        next[step.row][step.col] = value;
      } else {
        next[step.row][step.col] = 0;
      }
      return next;
    });
    setVisited((prev) => {
      const next = prev.map((row) => row.slice());
      const value = step.value;
      if (value === 0) {
        next[step.row][step.col] = true;
      } else {
        next[step.row][step.col] = false;
      }
      return next;
    });
    setActiveCell({ row: step.row, col: step.col });
    setCurrentStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setBoard(createEmptyBoard(solution.length, solution[0].length));
    setVisited(createVisitedBoard(solution.length, solution[0].length));
    setCurrentStep(0);
    setElapsed(0);
    setActiveCell(null);
  };

  return (
    <main className="app-root">
      <div className="app-shell">
        <HUD
          elapsed={elapsed}
          currentStep={currentStep}
          totalSteps={steps.length}
          mode={mode}
        />

        <section className="board-layout">
          <div className="mode-tabs">
            <button
              className={
                "mode-tab " + (mode === "normal" ? "mode-tab--active" : "")
              }
              onClick={() => setMode("normal")}
            >
              Normal
            </button>
            <button
              className={
                "mode-tab " + (mode === "color" ? "mode-tab--active" : "")
              }
              onClick={() => setMode("color")}
            >
              Color
            </button>
            <button
              className={
                "mode-tab " + (mode === "mega" ? "mode-tab--active" : "")
              }
              onClick={() => setMode("mega")}
            >
              Mega
            </button>
          </div>

          <Board
            board={board}
            rowClues={rowClues}
            colClues={colClues}
            activeCell={activeCell}
            isColorMode={isColorMode}
            visited={visited}
          />
        </section>

        <ControlsBar
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStep={handleStep}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>
    </main>
  );
}
