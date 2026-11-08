
import { JSXGraph } from "jsxgraph";
import { Utils } from "../../engine/utils";

console.log("[Quartz Graphs] Runtime loaded");

const utils = new Utils();

const activeBoards = new Map<HTMLElement, string>();

let boardCounter = 0;

function cleanupGraphs() {
  for (const [container, boardId] of activeBoards) {
    try {
      JSXGraph.freeBoard(boardId);
    } catch (error) {
      console.warn(
        "[Quartz Graphs] Board cleanup failed:",
        boardId,
        error,
      );
    }

    container.dataset.rendered = "false";
  }

  activeBoards.clear();
}

function renderGraphs() {
  const graphContainers =
    document.querySelectorAll<HTMLElement>(".quartz-graph");

  graphContainers.forEach((container) => {
    if (activeBoards.has(container)) return;

    const source = container.dataset.graphSource ?? "";
    const graphType = container.dataset.graphType;

    try {
      const graphInfo = utils.parseCodeBlock(
        source,
        graphType === "3d",
      );

      const boardElement = document.createElement("div");

      boardElement.id = `quartz-graph-board-${boardCounter++}`;
      boardElement.className = "jxgbox";

      container.replaceChildren(boardElement);

      const graph = utils.createBoard(boardElement, graphInfo);

      for (const element of graphInfo.elements ?? []) {
        utils.addElement(graph, element);
      }

      activeBoards.set(container, boardElement.id);

      container.dataset.rendered = "true";
      delete container.dataset.graphError;

      console.log(
        "[Quartz Graphs] Graph rendered:",
        boardElement.id,
      );
    } catch (error) {
      console.error(
        "[Quartz Graphs] Error rendering graph:",
        error,
      );

      container.textContent =
        `Graph error: ${
          error instanceof Error ? error.message : String(error)
        }`;

      container.dataset.graphError = "true";
    }
  });
}

// Initial page load.
renderGraphs();

// Cleanup before Quartz navigation.
document.addEventListener("prenav", cleanupGraphs);

// Initialize graphs after navigation.
document.addEventListener("nav", renderGraphs);

// Reinitialize when Quartz renders new content.
document.addEventListener("render", renderGraphs);
