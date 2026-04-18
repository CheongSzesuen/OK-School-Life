import device from "@system.device"

const DEFAULT_INFO = {
  screenWidth: 336,
  screenHeight: 480,
  screenShape: "rect"
}

function getProfileKey(info) {
  const width = info.screenWidth || DEFAULT_INFO.screenWidth
  const height = info.screenHeight || DEFAULT_INFO.screenHeight
  const shape = info.screenShape || DEFAULT_INFO.screenShape

  if (shape === "pill-shaped" && width === 192 && height === 490) {
    return "band9"
  }

  if (shape === "pill-shaped" && width === 212 && height === 520) {
    return "band10"
  }

  if (shape === "rect" && width === 336 && height === 480) {
    return "band9pro"
  }

  return "unknown"
}

const PROFILE_META = {
  band9: {
    name: "小米手环 9",
    layoutClass: "layout-pill device-band-9"
  },
  band10: {
    name: "小米手环 10",
    layoutClass: "layout-pill device-band-10"
  },
  band9pro: {
    name: "小米手环 9 Pro",
    layoutClass: "layout-rect device-band-9-pro"
  },
  unknown: {
    name: "未知设备",
    layoutClass: "layout-rect device-unknown"
  }
}

export function resolveProfileKeyByScreenWidth(screenWidth) {
  switch (screenWidth) {
    case 192:
      return "band9"
    case 212:
      return "band10"
    case 336:
      return "band9pro"
    default:
      return "unknown"
  }
}

export function resolveLayoutClassByScreenWidth(screenWidth) {
  const key = resolveProfileKeyByScreenWidth(screenWidth)
  const meta = PROFILE_META[key] || PROFILE_META.unknown
  return meta.layoutClass
}

export function resolveDeviceNameByScreenWidth(screenWidth) {
  const key = resolveProfileKeyByScreenWidth(screenWidth)
  const meta = PROFILE_META[key] || PROFILE_META.unknown
  return key === "unknown" ? "" : meta.name
}

export function resolveDeviceProfile(info = {}) {
  const normalizedInfo = Object.assign({}, DEFAULT_INFO, info)
  const key = getProfileKey(normalizedInfo)
  const meta = PROFILE_META[key] || PROFILE_META.unknown

  return {
    key,
    name: meta.name,
    layoutClass: meta.layoutClass,
    isPill: normalizedInfo.screenShape === "pill-shaped",
    isRect: normalizedInfo.screenShape === "rect",
    screenWidth: normalizedInfo.screenWidth,
    screenHeight: normalizedInfo.screenHeight,
    screenShape: normalizedInfo.screenShape
  }
}

export function getCachedDeviceProfile() {
  if (globalThis.deviceProfile) {
    return globalThis.deviceProfile
  }

  if (globalThis.screenSize || globalThis.screenShape) {
    return resolveDeviceProfile({
      screenWidth: globalThis.screenSize && globalThis.screenSize.width,
      screenHeight: globalThis.screenSize && globalThis.screenSize.height,
      screenShape: globalThis.screenShape
    })
  }

  return null
}

export function loadDeviceProfile(done) {
  const cached = getCachedDeviceProfile()
  if (cached) {
    done(cached)
    return
  }

  device.getInfo({
    success: (ret) => {
      const profile = resolveDeviceProfile(ret)
      globalThis.screenSize = {
        width: profile.screenWidth,
        height: profile.screenHeight
      }
      globalThis.screenShape = profile.screenShape
      globalThis.deviceProfile = profile
      done(profile)
    },
    fail: () => {
      const profile = resolveDeviceProfile()
      globalThis.screenSize = {
        width: profile.screenWidth,
        height: profile.screenHeight
      }
      globalThis.screenShape = profile.screenShape
      globalThis.deviceProfile = profile
      done(profile)
    }
  })
}
