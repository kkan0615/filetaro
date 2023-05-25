# Filetaro
File handler - File handler - Rename, Organize, or Delete files easiliy

[Go to download](https://github.com/kkan0615/filetaro/releases)

# Supports
## Contributors
Thank you for making program better.

[//]: # (max 7 td in each tr)
[//]: # (<a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Examples">💡</a> )
[//]: # (<a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Tests">⚠️</a>)
[//]: # (<a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Ideas, Planning, & Feedback">🤔</a>)
[//]: # (<a href="https://github.com/kkan0615/filetaro/issues?q=author%3Akkan0615" title="Bug reports">🐛</a>)
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/kkan0615">
          <img src="https://avatars.githubusercontent.com/u/46660361?v=4?s=64" width="64px;" alt="Youngjin Kwak"/><br /><sub><b>Youngjin Kwak</b></sub>
        </a><br />
        <a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Code">💻</a> 
        <a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Maintenance">🚧</a>
        <a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Documentation">📖</a> 
        <a href="https://github.com/kkan0615/filetaro/commits?author=kkan0615" title="Design">🎨</a>
      </td>
    </tr>
  </tbody>
</table>

## Supports
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/youngjinkwak)

# Development
Tauri(Rust) + React(Typescript)
## Commands
### Install
```bash
yarn install
```
### Dev
```bash
yarn tauri dev
```
### Build
```bash
yarn tauri build
```
Output is in
`./src-tarui/target/release/bundle/msi`

### Generate icons
[Doc]()
```bash
yarn tauri icon -o ./src-tauri/icons ./app-icon.png
```

## Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## :file_folder: Folder structure
See more detail to click the [Link](https://nuxt.com/docs/guide/directory-structure/nuxt)
```text
├─ dist/                                 # Build output
├─ node_modules/                         # Modules
├─ public/                               # Public Assets
├─ src/                                  # Work place for react
│   ├─ assets/                           # Assets
│   ├─ components/                       # Components
│   ├─ i18n/                             # i18n
│   │   ├─ ...                           #
│   │   └─ locales/                      # Messages by locale
│   ├─ layouts/                          # Layouts
│   ├─ pages/                            # Pages
│   ├─ router/                           # React router based routing system
│   ├─ stores/                           # Redux and Tauri store
│   ├─ styles/                           # Global css
│   ├─ types/                            # Types (Interfaces, Types, Constrains)
│   │   ├─ ...                           #
│   ├─  └─ models/                       # Model types
│   ├─ utils/                            # Utility functions
│   ├─ App.css/                          # App page css
│   ├─ App.tsx/                          # App ("/") page
│   ├─ index.scss/                       # Global css file
│   ├─ main.tsx                          # React main.tsx
│   └─ vite-env.d.ts                     # Vite.env.d.ts
├─ src-tauri/                            # Work place for Tauri and Rust
│   ├─ icons/                            # Icons
│   ├─ src/                              # src
│   ├─ target/                           # Build Output
│   ├─ .gitignore/                       # gitignore
│   ├─ build.rs/                         # Run build
│   ├─ Cargo.lock/                       # lock
│   ├─ Cargo.toml/                       # Rust Package
│   └─ tauri.conf.json/                  # Tauri Config
├─ .eslintignore/                        # Eslint ignore
├─ .eslint.cjs/                          # Eslint config
├─ .gitignore/                           # gitignore
├─ .index.html                           # index.html
├─ .package.json                         # package.json
├─ .package-lock.json                    # npm lock file
├─ .postcss.config.json                  # postcss config file
├─ README.md                             # README.md, intruction file
├─ .tailwind.config.cjs                  # tailwind config file
├─ .tsconfig.json                        # Typescript config file
├─ .tsconfig.node.json                   # Typescript node config file
├─ vite.config.ts                        # Vite config file
└── yarn.lock                            # Yarn lock
```

## Packages
The program is using following packages.

### Frontend
- [eslint]()
- [zod](https://zod.dev/): TypeScript-first schema validation with static type inference
  - [react-hook-form](https://react-hook-form.com/): Performant, flexible and extensible forms with easy-to-use validation.
  - [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
  - [react-router](https://reactrouter.com/en/main)
- [react-i18next](https://react.i18next.com/)
  - [i18next](https://react.i18next.com/)
  - [i18next-browser-languagedetector](https://www.npmjs.com/package/i18next-browser-languagedetector)
- [@chakra-ui/react](https://www.npmjs.com/package/@chakra-ui/react)
- [@emotion/react](https://emotion.sh/docs/introduction): Simple styling in React.
  - [@emotion/styled](https://emotion.sh/docs/styled)
- [framer-motion](https://github.com/framer/motion): An open source motion library for React, made by Framer.
- [tailwindcss](https://tailwindcss.com/)
  - [daisyui](https://daisyui.com/)
- [react-icons](https://react-icons.github.io/react-icons): Include popular icons in your React projects easily with react-icons, which utilizes ES6 imports that allows you to include only the icons that your project is using.
- [react-redux](https://github.com/reduxjs/react-redux): Official React bindings for Redux
  - [@reduxjs/toolkit](https://redux.js.org/): A Predictable State Container for JS Apps
- [@tauri-apps/api](https://tauri.app/v1/api/js/)
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction)
- [sass](https://sass-lang.com/): CSS with superpowers
- [reactour/tour](https://www.npmjs.com/package/@reactour/tour): Tourist Guide into your React Components
- [lodash](https://lodash.com/): A modern JavaScript utility library delivering modularity, performance & extras.
  - [@types/lodash](https://www.npmjs.com/package/@types/lodash)
 
### Backend
- [tauri-plugin-store](https://github.com/tauri-apps/tauri-plugin-store): Simple, persistent key-value store.

## Ref
- [tauri](https://tauri.app/)
- [awesome-tauri](https://github.com/tauri-apps/awesome-tauri)
