interface TextfitProps {
    /**
     * An update element, change in this element will trigger an update
     */
    update: any,
    /**
     * Minimum value for interpolation
     * Default: 1
     */
    min: number,
    /**
     * Maximum value for interpolation
     * Default 100
     */
    max: number,
    /**
     *  (single|multi) Algorithm to fit the text. Use single for headlines and multi for paragraphs. 
     *  Default is multi.
     */
    mode: "multi" | "single",
    /**
     * (Boolean) When mode is single and forceSingleModeWidth is true, the element's height will be ignored. 
     * Default is true.
     */
    forceSingleModeWidth: boolean,
    /**
     * (Number) Window resize throttle in milliseconds. Default is 50.
     */
    throttle: number,
    /**
     * Auto resize. Adds a listener to the window if true to detect changes.
     * Default: false
     */
    autoResize : boolean,
    /**
     * (Function) Will be called when text is fitted.
     */
    onReady:(finalFontSize: number )=>void,
    /**
     * Function to apply to the node, when a new interpolated value is checked. 
     * Default: (node, val) => node.style.fontSize = val + "px"
     */
    style : (node : Node, val : number) => node.style.fontSize = val + "px",
    /**
     * The width that should be enforced. Use eigther width & height or parent.
     * If parent is set, this is ignored
     * * Default: 100
     */
    width : number,
    /**
     * The height that should be enforced. Use eigther width & height or parent.
     * If parent is set, this is ignored
     * Default: 100
     */
    height : number,
    /**
     * Parent. Container, that should be filled.
     * 
     * Example:
     *   <div bind:this={parentDiv} style="width:300px;height:300px">
     *     <p use:textfit={{parent:parentDiv}}>{text}</p>
     *   </div>
     */
    parent : Node,
    /**
     * Custom function which checks, if the element fits the width. 
     * Default: (el,width)=>  {
     *    if (el.scrollWidth && el.scrollWidth>0){
     *       return el.scrollWidth - 1 <= width - 1;
     *    }
     *    return el.offsetWidth - 1 <= width - 1;
     * }
     */
    elementFitsWidth : (el : Node, width : number) => boolean
    /**
     * Custom function which checks, if the element fits the height. 
     * Default: (el,height)=>  {
     *    if (el.scrollHeight && el.scrollHeight>0){
     *       return el.scrollHeight - 1 <= height - 1;
     *    }
     *    return el.offsetHeight - 1 <= height - 1;
     * }
     */
    elementFitsHeight : (el : Node, width : number) => boolean
}


const textfit: (node: Node, props: TextfitProps) => ({
    update: (props: TextfitProps) => void,
    destroy: () => void
})
export { textfit }