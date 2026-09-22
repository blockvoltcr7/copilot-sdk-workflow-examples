import { CopilotClient } from "@github/copilot-sdk";
import { createInteractivePermissionHandler } from "../src/permissions.js";

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
    throw new Error(
        'Usage: npm run example:invoke-skill -- "Use the dynatrace-query skill to ..."',
    );
}

const client = new CopilotClient();
const permissions = createInteractivePermissionHandler();

try {
    const session = await client.createSession({
        model: "auto",
        enableConfigDiscovery: true,
        enableSkills: true,
        onPermissionRequest: permissions.handler,
    });

    try {
        const response = await session.sendAndWait({ prompt });
        console.log(response?.data.content ?? "No response returned.");

        const invoked = await session.rpc.skills.getInvoked();
        console.table(
            invoked.skills.map((skill) => ({
                name: skill.name,
                path: skill.path,
                invokedAtTurn: skill.invokedAtTurn,
                allowedTools: skill.allowedTools?.join(", ") ?? "",
            })),
        );
    } finally {
        await session.disconnect();
    }
} finally {
    permissions.close();
    await client.stop();
}
