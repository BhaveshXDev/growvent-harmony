
/**
 * A browser-friendly utility to help with icon-related functions
 */

/**
 * Checks if PWA icons exist and are properly configured
 * This is meant to be used in the browser environment
 */
export const checkPwaIconsStatus = (): boolean => {
  try {
    const manifest = document.querySelector('link[rel="manifest"]');
    if (!manifest) {
      console.warn('No manifest found, PWA icons may not be configured correctly');
      return false;
    }
    
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      console.warn('No apple-touch-icon found, iOS PWA icons may not be configured correctly');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking PWA icons status:', error);
    return false;
  }
};

/**
 * Instructions for manually generating icons
 */
export const getIconGenerationInstructions = (): string => {
  return `
    To generate icons for your PWA:
    
    1. Use an online tool like https://app-manifest.firebaseapp.com/ or https://www.pwabuilder.com/
    2. Upload your source image (public/lovable-uploads/e2d773ba-0e09-4901-8a3a-68e17dce87ab.png)
    3. Download the generated icons
    4. Place them in the public/icons directory
    5. Ensure your manifest.json references these icons correctly
  `;
};
