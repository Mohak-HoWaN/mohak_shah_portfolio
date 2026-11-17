import { renderToString } from "react-dom/server";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";

// Built by `vite build --ssr` and run by scripts/prerender.js. Mirrors App's DOM on "/": the router adds no elements
export const render = () =>
  renderToString(
    <>
      <Toaster />
      <Index />
    </>
  );
