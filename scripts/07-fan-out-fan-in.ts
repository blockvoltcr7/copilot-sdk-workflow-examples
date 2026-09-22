import { CopilotClient } from "@github/copilot-sdk";
import { resolve } from "node:path";
import { getExtensionSdkPath } from "../src/copilot.js";

const configuredProject = process.env.COPILOT_FACTORY_PROJECT;
if (!configuredProject) {
    throw new Error(
        "Set COPILOT_FACTORY_PROJECT to a project where fan-out-fan-in.extension.mjs is installed as .github/extensions/fan-out-fan-in/extension.mjs.",
    );
}

const issues = [
    {
        number: 101,
        title: "Add a health endpoint",
        body: "Expose GET /health and cover it with an integration test.",
    },
    {
        number: 102,
        title: "Improve retry telemetry",
        body: "Record retry count, terminal outcome, and request correlation ID.",
    },
    {
        number: 103,
        title: "Upgrade the cache client",
        body: "Upgrade the dependency. Acceptance criteria still need clarification.",
    },
];

const client = new CopilotClient({
    workingDirectory: resolve(configuredProject),
});

try {
    const session = await client.createSession({
        model: "auto",
        enableConfigDiscovery: true,
        enableExperimentalMode: true,
        requestExtensions: true,
        extensionSdkPath: getExtensionSdkPath(),
    });

    try {
        const run = await session.factory.run("prioritize-issues", {
            args: { issues },
            logPhaseNames: true,
        });

        console.log(JSON.stringify(run, null, 2));
        if (run.status !== "completed") {
            process.exitCode = 1;
        }
    } finally {
        await session.disconnect();
    }
} finally {
    await client.stop();
}
