# meowabyte.lol
[meowabyte.lol](https://meowabyte.lol) is my personal page written in [Vite](https://vite.dev/).

It is written in [Preact](https://preactjs.com) (originally in React) to keep sizes of files as low as possible while not sactificing it's quality from the original. It also uses various optimization techniques such as tree-shaking, dynamic imports, code splitting, minifing or prerendering (via [preact-iso](https://preactjs.com/guide/v10/preact-iso/) and it's `prerender` function) to make the site as performant as possible.  

**It includes plugins such as:**
- [TailwindCSS](https://tailwindcss.com/)
- [Vite-Image-Optimizer](https://www.npmjs.com/package/vite-plugin-image-optimizer)
- [Vite-Bundle-Analyzer](https://www.npmjs.com/package/vite-bundle-analyzer)

It also includes [my own plugins](/plugins/) for purposes like cleaning unused/build related files from `dist` that cannot be removed in normal way.

## Development
In this example I'm gonna use [bun](https://bun.sh/) as a package manager and runtime as well as and [git](https://git-scm.com/) for cloning the repo.
```bash
$ git clone https://github.com/meowabyte/meowabyte.github.io # Clone repo
$ cd "meowabyte.github.io" # Navigate to the project directory
$ bun install # Install requirements
$ bun dev # Run development server
```
If you made everything correctly, your terminal should show current url on which the page is being displayed.

## Building
Considering you've followed [steps above](#development) you probably wonder how to build it? It's quite easy.
```bash
# Build the project
$ bun build
```
And to see final results (where unlike with `bun dev` you'd have dev enviornment - with `bun build` you have already optimized files) just run `bun preview` to run built files in Vite's official production environment. (You can also use [serve](https://www.npmjs.com/package/serve) for more raw experience - `bunx serve dist` - which will use port `3000`)



## Licensing
As stated in [LICENSE file](/LICENSE), you can edit, modify or publish the code I included in here in any way as long as you provide any credit to it.