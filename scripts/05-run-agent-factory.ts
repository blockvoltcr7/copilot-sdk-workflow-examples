import { CopilotClient } from "@github/copilot-sdk";
import { resolve } from "node:path";
import { getExtensionSdkPath } from "../src/copilot.js";
import { createInteractivePermissionHandler } from "../src/permissions.js";

const issue = process.argv.slice(2).join(" ").trim();
if (!issue) {
    throw new Error(
        'Usage: npm run example:factory -- "Issue title and acceptance criteria"',
    );
}

const configuredProject = process.env.COPILOT_FACTORY_PROJECT;
if (!configuredProject) {
    throw new Error(
        "Set COPILOT_FACTORY_PROJECT to a project where the sample extension has been installed under .github/extensions.",
    );
}

const factoryProject = resolve(configuredProject);
const client = new CopilotClient({ workingDirectory: factoryProject });
const permissions = createInteractivePermissionHandler();

try {
    const session = await client.createSession({
        model: "auto",
        enableConfigDiscovery: true,
        enableSkills: true,
        enableExperimentalMode: true,
        requestExtensions: true,
        extensionSdkPath: getExtensionSdkPath(),
        onPermissionRequest: permissions.handler,
    });

    try {
        const response = await session.sendAndWait({
            prompt: [
                'Run the registered Agent Factory named "analyze-issue".',
                `Use these arguments: ${JSON.stringify({ issue })}`,
                "Wait for the run to finish and report the result.",
            ].join("\n"),
        });

        console.log(response?.data.content ?? "No response returned.");
    } finally {
        await session.disconnect();
    }
} finally {
    permissions.close();
    await client.stop();
}
