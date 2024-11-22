export const isMobileDevice = () => {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 判断是否为移动设备
    const isPhoneOrTablet = /android|iphone|ipad|ipod|windows phone|blackberry|mobile/i.test(userAgent.toLowerCase());

    // 辅助判断是否为触摸设备
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isPhoneOrTablet || isTouch;
}