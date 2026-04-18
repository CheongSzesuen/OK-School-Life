# scripts

## `patch_aiot_toolkit_ignore_pref.cjs`

作用：
- 直接修改本地 `node_modules` 里的 `aiot-toolkit` 配置
- 给 `UxConfig.js` 补上 `pref/` 忽略规则
- 让 `aiot start/build/release` 在扫描项目时跳过 `pref/`

适用场景：
- 重新执行 `pnpm install`
- 删除并重装 `node_modules`
- `aiot-toolkit` 被覆盖后需要重新补丁

运行方式：

```bash
node scripts/patch_aiot_toolkit_ignore_pref.cjs
```
