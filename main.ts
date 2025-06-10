import { App, Notice, Platform, Plugin } from "obsidian";

export default class GitShowFilePlugin extends Plugin {
  async onload() {
    console.log(
      "loading " + this.manifest.name + " plugin: v" + this.manifest.version,
    );

    this.addCommand({
      id: "git-show",
      name: "Show Git File Contents",
      callback: () => this.showGitFileContents(),
    });
  }
  onLayoutReady() {
    // Check for obsidian-git plugin
    let gitManager = (<any>this.app).plugins.getPlugin("obsidian-git");
    if (!gitManager) {
      new Notice(
        "The Obsidian Git Plugin was not found. This is needed for this Plugin.",
      );
    }
  }

  async showGitFileContents() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return;

    const fileContent = await this.app.vault.read(activeFile);
    const updatedContent = await this.processGitShowBlocks(fileContent);

    await this.app.vault.modify(activeFile, updatedContent);
  }

  async processGitShowBlocks(content: string) {
    // regex matches: ```${filetype}<<space+>>git-show<<space+>>${branchOrHash}:${filePath}[:${startLine[:${endLine}]]<<space+>>\n<<rest>>*```
    const gitShowRegex =
      /```([\w.-]+)\s+--\s+git-show\s+([\w.-]+):([\w/.-]+)(?::(\d+)(?::(\d+))?)?\s*([\s\S]*?)```/g;

    const promises = [];
    let match;

    while ((match = gitShowRegex.exec(content)) !== null) {
      const [fullMatch, fileType, branchOrHash, filePath, startLine, endLine] =
        match;

      // Create a promise for each replacement
      const replacementPromise = (async () => {
        const resolvedHash = await this.resolveBranchOrHash(branchOrHash);
        const fileContents = await this.getFileContents(
          resolvedHash,
          filePath,
          startLine,
          endLine,
        );
        const start = startLine ? `:${startLine}` : ":1";
        const end = endLine ? `:${endLine}` : "";
        return {
          fullMatch,
          newBody: `\`\`\`${fileType} -- git-show ${branchOrHash}:${filePath}${start}${end}\n${fileContents}\n\`\`\``,
        };
      })();

      promises.push(replacementPromise);
    }

    // Wait for all replacements to complete
    const replacements = await Promise.all(promises);

    // Replace the original content with the new content
    for (const { fullMatch, newBody } of replacements) {
      content = content.replace(fullMatch, newBody);
    }

    return content;
  }
  async resolveBranchOrHash(branchOrHash: string) {
    const args = [];
    args.push("rev-parse", branchOrHash);
    return await this.git(args).then((x) => x.trim());
  }

  async getFileContents(
    commitHash: string,
    filePath: string,
    startLine: string,
    endLine: string,
  ): Promise<string> {
    const args = [];
    args.push("show", `${commitHash}:${filePath}`);
    const lines = await this.git(args).then((x) => x.split("\n"));
    var start = startLine ? parseInt(startLine) - 1 : 0;
    start = start > 0 ? start : 1;
    var end = endLine ? parseInt(endLine) : lines.length;
    if (end === start) {
      end = start + 1;
    } else if (end < start) {
      end = lines.length;
    }

    end = end > start ? end : lines.length;

    const body = lines.slice(start, end).join("\n");
    return body;
  }
  git(args: string[]): Promise<string> {
    let obsidianApp = <any>this.app;
    let gitManager = obsidianApp.plugins.getPlugin("obsidian-git").gitManager;
    console.log("gitManager is: ", gitManager);
    return gitManager.git.raw(args);
  }
}
