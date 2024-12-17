import { ScriptLoader } from '../../../main/ts/ScriptLoader';

/** Function to clean up and remove HugeRTE-related scripts and links from the document */
const cleanupGlobalHugeRTE = (): void => {
  ScriptLoader.reinitialize();
  delete (globalThis as any).hugerte;
  delete (globalThis as any).hugeRTE;
  /** Helper function to check if an element has a HugeRTE-related URI in a specific attribute */
  const hasHugeRTEUri = (attrName: string) => (elm: Element): boolean => {
    const src = elm.getAttribute(attrName);
    return src != null && src.includes('hugerte');
  };
  // Find all script and link elements that have a HugeRTE-related URI
  [
    ...Array.from(document.querySelectorAll('script')).filter(hasHugeRTEUri('src')),
    ...Array.from(document.querySelectorAll('link')).filter(hasHugeRTEUri('href'))
  ].forEach((elm) => elm.remove());
};

export {
  cleanupGlobalHugeRTE,
};
