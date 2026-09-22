import { CopilotClient } from "@github/copilot-sdk";
import { getExtensionSdkPath } from "../src/copilot.js";

const client = new CopilotClient();

try {
    const session = await client.createSession({
        model: "auto",
        enableConfigDiscovery: true,
        enableSkills: true,
        extensionSdkPath: getExtensionSdkPath(),
    });

    try {
        await session.rpc.skills.ensureLoaded();
        const catalog = await session.rpc.skills.list();

        console.table(
            catalog.skills.map((skill) => ({
                name: skill.name,
                source: skill.source,
                enabled: skill.enabled,
                userInvocable: skill.userInvocable,
                description: skill.description,
            })),
        );
    } finally {
        await session.disconnect();
    }
} finally {
    await client.stop();
}
