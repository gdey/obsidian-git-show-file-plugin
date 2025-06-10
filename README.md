# Obsidian Vault

This branch is my notes for working on this repo.

Something interesting, is that I had a hard time with getting the git parse commands
to work. I really don't know typescript, and had to hack my way through it.

```typescript -- git-show main:main.ts:106:111
  git(args: string[]): Promise<string> {
    let obsidianApp = <any>this.app;
    let gitManager = obsidianApp.plugins.getPlugin("obsidian-git").gitManager;
    console.log("gitManager is: ", gitManager);
    return gitManager.git.raw(args);
  }
```


```typescript -- git-show 60c296:main.ts:100:111

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
```

