
import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";

import style from "./styles/graph.scss";

// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/graph.inline.ts";

export default (() => {
  const Component: QuartzComponent = (_props: QuartzComponentProps) => {
    return <div class="quartz-graph-runtime" hidden />;
  };

  Component.css = style;
  Component.afterDOMLoaded = script;

  return Component;
}) satisfies QuartzComponentConstructor;
