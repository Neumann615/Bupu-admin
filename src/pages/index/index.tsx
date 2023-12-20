import {Responsive as ResponsiveGridLayout} from 'react-grid-layout';
import GridLayout from 'react-grid-layout';
import {useRef, useState} from "react";
import {useMount} from "ahooks";

export default () => {
    const homeLayoutRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const layout = [
        {i: 'a', x: 0, y: 0, w: 6, h: 4, static: true},
        {i: 'b', x: 6, y: 0, w: 6, h: 2, minW: 2, maxW: 4},
        {i: 'c', x: 4, y: 0, w: 1, h: 2},
        {i: 'd', x: 0, y: 0, w: 1, h: 2, static: true},
        {i: 'e', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
        {i: 'f', x: 4, y: 0, w: 1, h: 2}
    ];
    useMount(() => {
        console.log({a: homeLayoutRef.current})
        setIsLoading(false)
    })
    return <div ref={homeLayoutRef} style={{width: "100%", height: "100%"}}>
        {isLoading ? null : <GridLayout ref={homeLayoutRef} className="layout"
                                        layout={layout}
                                        isDraggable={false}
                                        cols={12}
                                        width={homeLayoutRef?.current?.clientWidth}
                                        rowHeight={30}>
            <div key="a" style={{backgroundColor: "#409eff"}}>a</div>
            <div key="b" style={{backgroundColor: "#409eff"}}>b</div>
            <div key="c" style={{backgroundColor: "#409eff"}}>c</div>
            <div key="d" style={{backgroundColor: "#409eff"}}>d</div>
            <div key="e" style={{backgroundColor: "#409eff"}}>e</div>
            <div key="f" style={{backgroundColor: "#409eff"}}>f</div>
        </GridLayout>}
    </div>

}