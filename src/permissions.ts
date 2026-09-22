import type { PermissionHandler, PermissionRequest } from "@github/copilot-sdk";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

function summarizePermission(request: PermissionRequest): string {
    switch (request.kind) {
        case "shell":
            return `Shell command: ${request.fullCommandText}`;
        case "read":
            return `Read path: ${request.path}`;
        case "write":
            return `Write file: ${request.fileName}`;
        case "url":
            return `Network request: ${JSON.stringify(request)}`;
        case "factory":
            return `Agent Factory: ${request.description}`;
        default:
            return `${request.kind}: ${JSON.stringify(request)}`;
    }
}
export function createInteractivePermissionHandler(): {
    handler: PermissionHandler;
    close: () => void;
} {
    const terminal = createInterface({ input: stdin, output: stdout });

    const handler: PermissionHandler = async (request) => {
        console.error(`\nPermission requested\n${summarizePermission(request)}`);

        if (request.managedApprovalRequired) {
            console.error("Managed policy requires approval through the host UI.");
            return { kind: "no-result" };
        }

        const answer = await terminal.question("Approve once? [y/N] ");
        return answer.trim().toLowerCase() === "y"
            ? { kind: "approve-once" }
            : { kind: "reject", feedback: "Denied by the local operator." };
    };

    return {
        handler,
        close: () => terminal.close(),
    };
}
