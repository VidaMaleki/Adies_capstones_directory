export function getImageByAppType(appType: String) {
    let imagePath = '/images/nativeApp.png';
    
    if (appType === 'Web') {
        imagePath = '/images/webApp.png';
    } else if (appType === 'Mobile') {
        imagePath = '/images/mobileApp.png';
    } else {
        imagePath = '/images/nativeApp.png';
    }
    
    return imagePath;
}