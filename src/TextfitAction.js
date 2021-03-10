/**
 * Ported from react-textfit@1.1.1 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 react-textfit
 * */
import {tick}from 'svelte'
import series from "./utils/series";
import whilst from "./utils/whilst";
import throttleFun from "./utils/throttle";
import uniqueId from "./utils/uniqueId";
import { innerWidth, innerHeight } from "./utils/innerSize";



function assertElementFitsWidth(el, width) {
    if (el.scrollWidth && el.scrollWidth>0){
        console.log(el.scrollWidth,el.scrollWidth - 1 <= width - 1, width)

        // -1: temporary bugfix, will be refactored soon
        return el.scrollWidth - 1 <= width - 1;
    }
    return el.offsetWidth - 1 <= width - 1;
}

function assertElementFitsHeight(el, height) {
    if (el.scrollHeight && el.scrollHeight >0 ){
        // -1: temporary bugfix, will be refactored soon
        return el.scrollHeight - 1 <= height - 1;
    }
    return el.offsetHeight - 1 <= height - 1
    
}

function noop() {}


export const textfit = (node, props) => {
   
    let {throttle = 10,
        autoResize = false} = props;
    //state
    let fontSize = null,
        ready = false;

    let _pid;

    const execution = (props) => {
        let { min = 1,
            max = 100,
            mode = "multi",
            forceSingleModeWidth = true,
            onReady = noop,
            style = (node, val) => node.style.fontSize = val + "px",            
            width,
            height,
            parent,
            elementFitsWidth = assertElementFitsWidth,
            elementFitsHeight = assertElementFitsHeight
        } = props;

        const el = parent;
        const wrapper = node;

        let originalWidth = width||wrapper.scrollWidth||wrapper.offsetWidth;
        let originalHeight = height||wrapper.scrollHeight||wrapper.offsetHeight;

        if (parent){
            originalWidth = innerWidth(el);
            originalHeight = innerHeight(el);
        }

        if (originalHeight <= 0 || isNaN(originalHeight)) {
            console.warn('Can not process element without height. Make sure the element is displayed and has a static height.');
            return;
        }

        if (originalWidth <= 0 || isNaN(originalWidth)) {
            console.warn('Can not process element without width. Make sure the element is displayed and has a static width.');
            return;
        }

        const pid = uniqueId();
        _pid = pid;

        const shouldCancelProcess = () => pid !== _pid;

        const testPrimary = mode === 'multi'
            ? () => elementFitsHeight(wrapper, originalHeight)
            : () => elementFitsWidth(wrapper, originalWidth);

        const testSecondary = mode === 'multi'
            ? () => elementFitsWidth(wrapper, originalWidth)
            : () => elementFitsHeight(wrapper, originalHeight);

        let mid;
        let low = min;
        let high = max;

        ready = false;
        series([
            // Step 1:
            // Binary search to fit the element's height (multi line) / width (single line)
            stepCallback => whilst(
                () => low <= high,
                whilstCallback => {
                    if (shouldCancelProcess()) return whilstCallback(true);
                    mid = parseInt((low + high) / 2, 10);
                    fontSize = mid;
                    style(node,fontSize);
                    tick().then(() => {
                        if (shouldCancelProcess()) return whilstCallback(true);
                        if (testPrimary()) low = mid + 1;
                        else high = mid - 1;
                        return whilstCallback();
                    });
                },
                stepCallback,
                tick
            ),
            // Step 2:
            // Binary search to fit the element's width (multi line) / height (single line)
            // If mode is single and forceSingleModeWidth is true, skip this step
            // in order to not fit the elements height and decrease the width
            stepCallback => {
                if (mode === 'single' && forceSingleModeWidth) return stepCallback();
                if (testSecondary()) return stepCallback();
                low = min;
                high = mid;
                return whilst(
                    () => low <= high,
                    whilstCallback => {
                        if (shouldCancelProcess()) return whilstCallback(true);
                        mid = parseInt((low + high) / 2, 10);
                        fontSize = mid;
                        style(node,fontSize);
                        tick().then(() => {
                            if (pid !== _pid) return whilstCallback(true);
                            if (testSecondary()) low = mid + 1;
                            else high = mid - 1;
                            return whilstCallback();
                        });
                    },
                    stepCallback
                );
            },
            // Step 3
            // Limits
            stepCallback => {
                // We break the previous loop without updating mid for the final time,
                // so we do it here:
                mid = Math.min(low, high);

                // Ensure we hit the user-supplied limits
                mid = Math.max(mid, min);
                mid = Math.min(mid, max);

                // Sanity check:
                mid = Math.max(mid, 0);
                

                if (shouldCancelProcess()) return stepCallback(true);
                fontSize = mid;
                style(node,fontSize);
                tick().then(stepCallback);
            }
        ], err => {
            // err will be true, if another process was triggered
            if (err || shouldCancelProcess()) return;
            ready = true;
            tick().then(() => onReady(mid));
        });


        
    }

    const handleWindowResize = throttleFun(()=>execution(props), throttle);

    if (autoResize) {
        window.addEventListener('resize', handleWindowResize);
    }

    tick().then(()=>execution(props));

    return {
        destroy: () => {
            if (autoResize) {
                window.removeEventListener('resize', handleWindowResize);
            }
            // Setting a new pid will cancel all running processes
            _pid = uniqueId();

        },
        update: (props)=>{
            tick().then(_=>execution(props));
        }
    }
}