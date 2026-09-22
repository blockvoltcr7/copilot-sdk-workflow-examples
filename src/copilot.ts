import { createRequire } from "node:module";
import { dirname } from "node:path";

const require = createRequire(import.meta.url);

export function getExtensionSdkPath(): string {
    return dirname(require.resolve("@github/copilot-sdk/extension"));
}
