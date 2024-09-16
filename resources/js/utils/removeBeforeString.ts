export function removeBeforeString(url: string): string {
    const assetsIndex = url.indexOf('/assets/');
    if (assetsIndex !== -1) {
        return url.substring(assetsIndex);
    }
    return url; // Return the original string if '/assets/' is not found
}