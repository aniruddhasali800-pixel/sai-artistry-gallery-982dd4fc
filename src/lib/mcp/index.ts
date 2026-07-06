import { defineMcp } from "@lovable.dev/mcp-js";
import listPaintings from "./tools/list-paintings";
import getPainting from "./tools/get-painting";
import listUpcoming from "./tools/list-upcoming";
import getAbout from "./tools/get-about";

export default defineMcp({
  name: "sali-arts-mcp",
  title: "Sali Arts",
  version: "0.1.0",
  instructions:
    "Tools for browsing the Sali Arts online gallery: list paintings (available or sold), get painting details, list upcoming projects, and read About/Contact info.",
  tools: [listPaintings, getPainting, listUpcoming, getAbout],
});