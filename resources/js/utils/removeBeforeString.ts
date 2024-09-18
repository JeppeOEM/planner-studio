export function removeBeforeString(url: string): string {
    console.log(url, "url beore cut");
    const assetsIndex = url.indexOf('/assets/');
    if (assetsIndex !== -1) {
        return url.substring(assetsIndex);
    }
    return url; // Return the original string if '/assets/' is not found
}       