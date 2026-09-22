import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { issueCandidateSchema, type IssueCandidate } from "./contracts.js";

const execFileAsync = promisify(execFile);

type GhIssue = {
    number: number;
    title: string;
    body?: string;
    url: string;
    author?: { login?: string };
    labels?: Array<{ name?: string }>;
    createdAt: string;
    updatedAt: string;
};

export async function getCurrentRepository(): Promise<string> {
    const { stdout } = await execFileAsync("gh", [
        "repo",
        "view",
        "--json",
        "nameWithOwner",
        "--jq",
        ".nameWithOwner",
    ]);

    return stdout.trim();
}
export async function listCopilotReadyIssues(limit = 50): Promise<IssueCandidate[]> {
    const { stdout } = await execFileAsync("gh", [
        "issue",
        "list",
        "--state",
        "open",
        "--label",
        "copilot_ready",
        "--limit",
        String(limit),
        "--json",
        "number,title,body,url,author,labels,createdAt,updatedAt",
    ]);

    const raw = JSON.parse(stdout) as GhIssue[];

    return raw.map((issue) =>
        issueCandidateSchema.parse({
            number: issue.number,
            title: issue.title,
            body: (issue.body ?? "").slice(0, 8_000),
            url: issue.url,
            author: issue.author?.login ?? "unknown",
            labels: (issue.labels ?? []).flatMap((label) =>
                label.name ? [label.name] : [],
            ),
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
        }),
    );
}
