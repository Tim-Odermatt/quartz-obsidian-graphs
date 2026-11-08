import type { PluggableList, Plugin } from "unified";
import type { Root as MdastRoot } from "mdast";
import type { Root as HastRoot, Element } from "hast";
import type { VFile } from "vfile";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { findAndReplace } from "mdast-util-find-and-replace";
import { visit } from "unist-util-visit";
import type { QuartzTransformerPlugin, BuildCtx } from "@quartz-community/types";
import type { ExampleTransformerOptions } from "./types";

const defaultOptions: ExampleTransformerOptions = {
  highlightToken: "==",
  headingClass: "example-plugin-heading",
  enableGfm: true,
  addHeadingSlugs: true,
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const remarkHighlightToken = (token: string): Plugin<[], MdastRoot> => {
  const escapedToken = escapeRegExp(token);
  const pattern = new RegExp(`${escapedToken}([^\n]+?)${escapedToken}`, "g");
  return () => (tree: MdastRoot, _file: VFile) => {
    findAndReplace(tree, [
      [
        pattern,
        (_match: string, value: string) => ({
          type: "strong",
          children: [{ type: "text", value }],
        }),
      ],
    ]);
  };
};

const rehypeHeadingClass = (className: string): Plugin<[], HastRoot> => {
  return () => (tree: HastRoot, _file: VFile) => {
    visit(tree, "element", (node: Element) => {
      if (!/^h[1-6]$/.test(node.tagName)) {
        return;
      }

      const existing = node.properties?.className;
      const classes: string[] = Array.isArray(existing)
        ? existing.filter((value): value is string => typeof value === "string")
        : typeof existing === "string"
          ? [existing]
          : [];
      node.properties = {
        ...node.properties,
        className: [...classes, className],
      };
    });
  };
};




const getCodeText = (element: Element): string => {
  return element.children
    .map((child) => {
      if (child.type === "text") {
        return child.value;
      }

      if (child.type === "element") {
        return getCodeText(child);
      }

      return "";
    })
    .join("");
};

const rehypeGraphBlocks: Plugin<[], HastRoot> = () => {
  return (tree: HastRoot) => {
    console.log("[Quartz Graphs] Rehype transformer running");

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) {
        return;
      }

      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );

      if (!code) return;

      const properties = code.properties ?? {};
      const preProperties = node.properties ?? {};

      // Support both original language classes and Quartz's
      // syntax-highlighted data-language attributes.
      const className = properties.className;

      const classList: string[] = Array.isArray(className)
        ? className.map(String)
        : [];

      const language = String(
        Reflect.get(properties, "data-language") ??
        Reflect.get(properties, "dataLanguage") ??
        Reflect.get(preProperties, "data-language") ??
        Reflect.get(preProperties, "dataLanguage") ??
        "",
      ).toLowerCase();

      let graphType: string | undefined;

      if (
        classList.includes("language-graph") ||
        language === "graph"
      ) {
        graphType = "2d";
      } else if (
        classList.includes("language-graph3d") ||
        language === "graph3d"
      ) {
        graphType = "3d";
      }

      if (!graphType) return;

      // Extract YAML even when syntax highlighting has
      // wrapped individual lines in nested span elements.
      const source = getCodeText(code);

      console.log("[Quartz Graphs] Graph block detected:", {
        graphType,
        source,
      });

      const graphContainer: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["quartz-graph"],
          dataGraphType: graphType,
          dataGraphSource: source,
        },
        children: [],
      };

      parent.children[index] = graphContainer;
    });
  };
};



/**
 * Example transformer showing remark/rehype usage and resource injection.
 */
export const GraphTransformer: QuartzTransformerPlugin<Partial<ExampleTransformerOptions>> = (
  userOptions?: Partial<ExampleTransformerOptions>,
) => {
  const options = { ...defaultOptions, ...userOptions };
  return {
    name: "GraphTransformer",
    textTransform(_ctx: BuildCtx, src: string) {
      return src.endsWith("\n") ? src : `${src}\n`;
    },
    markdownPlugins(): PluggableList {
      const plugins: PluggableList = [remarkHighlightToken(options.highlightToken)];
      if (options.enableGfm) {
        plugins.unshift(remarkGfm);
      }
      return plugins;
    },
    htmlPlugins(): PluggableList {
      console.log("[Quartz Graphs] HTML transformer registered");
      const plugins: PluggableList = [
        rehypeGraphBlocks,
        rehypeHeadingClass(options.headingClass),
      ];
      if (options.addHeadingSlugs) {
        plugins.unshift(rehypeSlug);
      }
      return plugins;
    },
    externalResources() {
      return {
        css: [
          {
            content: `.${options.headingClass} { letter-spacing: 0.02em; }`,
            inline: true,
          },
        ],
        js: [
          {
            contentType: "inline",
            loadTime: "afterDOMReady",
            script: "document.documentElement.dataset.exampleTransformer = 'true'",
          },
        ],
        additionalHead: [],
      };
    },
  };
};
