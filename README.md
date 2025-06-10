# obsidian-git-show-file-plugin
A simple Obsidian Plugin that allow one to embed the contents (whole or part) of
a file into a code block, based on the the git branch or hash, file path, and
start and end line numbers. Git and [obsidian-git](https://github.com/Vinzent03/obsidian-git) is required.

## Why?

The reason for this plugin is because I wanted a simple way to include
the contents of a file in a different branch. This is especially useful
if you are writing tutorials and want to make sure your tutorials are buildable.

It would be better to have the system be able to grab the code for you from the
branch or commit hash for that version of the file.


The way this is done is by annotating the code block after the file type with
information on how to get the contents of the file.

In this case we are looking at `typescript` code, then followed by `--` to
indicate the start of the command (`git-show`) to run, and the parameters to that command.

The first parameter is the name of a branch, tag, or a git hash.
With a branch name, it will change the content as the branch evolves. This may mean you
will have to adjust the start and end line numbers to keep the same context.

If it's a tag name or commit hash, then the content will not change. 

> [!NOTE]
> 
> Since this is not keep a pointer to the file. It is possible for git's
> garabage collector to reclaim the file, if nothing else points to it.
> 
> A future enhancement to this plugin, may be to add a link to the file
> in a temp branch or location. So, that the gc does not remove it.
>

The next parameter is the path to the file. In the following example, the
file is at the root [main.ts], so it's just the file name.

The following two paramerers are optional — the first one is the starting
line number. It start at 1, and goes to the length of the file. The next
one is the ending line. If this is not provided, or smaller then the
start it will include the rest of the file. If the end line number is equal to
the start, that only that line will be shown. 

```typescript -- git-show main:main.ts:106:111
  git(args: string[]): Promise<string> {
    let obsidianApp = <any>this.app;
    let gitManager = obsidianApp.plugins.getPlugin("obsidian-git").gitManager;
    console.log("gitManager is: ", gitManager);
    return gitManager.git.raw(args);
  }
```


```typescript -- git-show 60c296:main.ts:106:111
  git(args: string[]): Promise<string> {
    let obsidianApp = <any>this.app;
    let gitManager = obsidianApp.plugins.getPlugin("obsidian-git").gitManager;
    console.log("gitManager is: ", gitManager);
    return gitManager.git.raw(args);
  }
```

## Code

I'm not familar with writing plugins for Obsidian (This is my first,) or with typescript.
So, I'm sure the code is not the best. But it seems to do what I want it to. Please,
make use of this if it seems useful to you. But use it at your own risk. Luckly, it's
not very big.


## Contributations

Contributations are always welcome, but not guaranteed to be applied.

