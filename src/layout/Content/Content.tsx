import { createStyles } from "antd-style"
import React, { useRef } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { useAppStore, useMainPageStore } from "@/store"
import { transitionTypeSet } from "@/utils"

const useStyles = createStyles(({ token, css }) => ({
    content: {
        width: "auto",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: token.colorBgLayout
    },
    outletContainer: {
        width: "100%",
        height: "100%"
    }
}))

export function Content() {
    const { styles } = useStyles()
    const { nodeRef } = useRef(null)
    const currentOutlet = useOutlet()
    const location = useLocation()
    const { startGlobalProgressLoading, stopGlobalProgressLoading, globalProgressLoading } = useAppStore()
    const { transitionType } = useMainPageStore()
    return <div className={styles.content} style={{ overflow: globalProgressLoading ? "hidden" : "auto" }}>
        <SwitchTransition mode="out-in">
            <CSSTransition
                nodeRef={nodeRef}
                unmountOnExit
                onEntered={stopGlobalProgressLoading}
                onExit={startGlobalProgressLoading}
                key={location.key}
                timeout={500}
                classNames={transitionTypeSet[transitionType]}>
                <div className={styles["outletContainer"]} ref={nodeRef}>
                    {currentOutlet}
                </div>
            </CSSTransition>
        </SwitchTransition>
    </div>
}