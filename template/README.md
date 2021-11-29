# Vue 3 + Typescript + Vite

## Features

- `windiCSS` + `vite-plugin-windicss` 原子样式
- `vite-plugin-pages` 基于文件的路由
- `vite-plugin-vue-layouts` 布局管理
- `unplugin-auto-import` APIs 按需自动引入 
- `unplugin-vue-components` `components` 组件自动引入
- `unplugin-icons` 图标（Powered by Iconify）以`icon-${collection}-${name}`的形式使用，按需引入，`src/assets/icons`文件夹下的图标自动注册为`icon-custom-${name}`


## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
