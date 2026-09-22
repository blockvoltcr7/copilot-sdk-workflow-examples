import { CopilotClient } from "@github/copilot-sdk";

const request = process.argv.slice(2).join(" ").trim() || "Explain the current repository.";
const client = new CopilotClient();

try {
    const session = await client.createSession({
        model: "auto",
        customAgents: [
            {
                name: "repository-researcher",
                displayName: "Repository Researcher",
                description: "Explores a repository and reports evidence without editing files.",
                prompt: [
                    "You are a read-only repository researcher.",
                    "Cite the files that support your conclusions.",
                    "Do not modify files or execute destructive commands.",
                ].join(" "),
            },
        ],
        agent: "repository-researcher",
    });

    try {
        const response = await session.sendAndWait({ prompt: request });
        console.log(response?.data.content ?? "No response returned.");
    } finally {
        await session.disconnect();
    }
} finally {
    await client.stop();
}
