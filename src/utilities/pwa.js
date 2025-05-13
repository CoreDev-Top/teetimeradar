export const getDeviceInfo = (UserAgent) => {
    const Device = UserAgent.getDevice()
    const OS = UserAgent.getOS()

    return {
        device: {
            isMobile: Device.type === 'mobile',
            isTablet: Device.type === 'tablet',
            isAndroid: OS.name === 'Android',
            isIOS: OS.name === 'iOS',
        },
        pwa: {
            isStandalone: (window) =>
                window.matchMedia('(display-mode: standalone)').matches,
        },
        userAgent: UserAgent.getUA(),
        browser: UserAgent.getBrowser(),
    }
}
