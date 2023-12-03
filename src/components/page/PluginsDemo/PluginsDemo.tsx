import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useMount } from 'ahooks'
import { createStyles } from 'antd-style'
import { Alert, Row, Col, Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
//react-quill
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
//react-codemirror
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
//rc-slider-captcha
import ImageBg1 from '@/assets/img/0699.jpg';
import ImageBg2 from '@/assets/img//0723.jpg';
import createPuzzle, { Result } from 'create-puzzle'
import SliderCaptcha, { ActionType } from 'rc-slider-captcha';

type PluginName = "react-quill" | "react-codemirror" | "rc-slider-captcha"

interface PluginsDemoProps {
    pluginName: PluginName
}

const useStyles = createStyles(({ token, css }) => ({
    pluginsDemo: {
        width: "100%",
        height: "100%"
    },
    pluginsDemoHeader: {
        width: "100%",
        height: "auto",
        boxSizing: "border-box",
        padding: token.paddingMD,
        backgroundColor: token.colorBgContainer
    },
    pluginsDemoHeaderTitle: {
        fontSize: token.fontSizeHeading4,
        color: token.colorTextBase
    },
    pluginsDemoBody: {
        boxSizing: "border-box",
        padding: token.paddingMD
    },
    pluginsDemoReactQuill: css`
    box-sizing:border-box;
    padding:${token.paddingMD}px;
    .ql-toolbar{
        background-color:${token.colorBgContainer};
        border:none;
        border-bottom:1px solid ${token.colorBorderSecondary};
        color:${token.colorTextSecondary}
    }
    .ql-container{
        background-color:${token.colorBgContainer};
        border:none;
        color:${token.colorTextSecondary}
    }
    `,
    pluginsDemoSlider: css`
    background-color:${token.colorBgContainer};
    box-sizing:border-box;
    padding:${token.paddingContentHorizontalSM}px;
    margin-bottom:${token.marginMD}px;
    `,
    pluginsDemoSliderTitle: {
        color: token.colorTextBase,
        marginBottom: token.marginMD
    },
    pluginsDemoSliderDescription: {
        color: token.colorTextDescription,
        marginBottom: token.marginMD,
        fontSize:token.fontSize
    },
    customSliderDemo: {
        "--rcsc-primary": token["blue-5"],
        "--rcsc-primary-light": token['blue-2'],
        "--rcsc-error": token["red-5"],
        "--rcsc-error-light": token['red-2'],
        "--rcsc-success": token["green-5"],
        "--rcsc-success-light": token['green-2'],
        "--rcsc-border-color": token.colorBorderSecondary,
        "--rcsc-bg-color": token.colorBgContainer,
        "--rcsc-text-color": token.colorTextBase
    }
}))

function openDocumentPage(pluginName: PluginName) {
    let doucmentPageUrlSet: any = {
        "react-quill": "https://github.com/zenoamaro/react-quill",
        "react-codemirror": "https://github.com/uiwjs/react-codemirror",
        "rc-slider-captcha": "https://www.npmjs.com/package/rc-slider-captcha"
    }
    window.open(doucmentPageUrlSet[pluginName])
}


function ReactQuillDemo() {
    const { styles, theme } = useStyles()
    const [value, setValue] = useState('');
    return <div className={styles["pluginsDemo"]}>
        <div className={styles["pluginsDemoHeader"]}>
            <Alert type={"warning"} message={"说明:插件模块仅作为第三方插件的演示页面，用来梳理整合逻辑和范例，框架本身并不包含这些插件。"}></Alert>
            <Row align={"middle"} style={{ marginTop: theme.marginMD }}>
                <Col span={12}>
                    <span className={styles["pluginsDemoHeaderTitle"]}>富文本(react-quill)</span>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button onClick={() => {
                        openDocumentPage("react-quill")
                    }} icon={<LinkOutlined></LinkOutlined>}>项目地址</Button>
                </Col>
            </Row>
        </div>
        <div className={styles["pluginsDemoReactQuill"]}>
            <ReactQuill style={{ height: "600px" }} theme="snow" value={value} onChange={setValue} />
        </div>
    </div>
}

function ReactCodeMirrorDemo() {
    const { styles, theme } = useStyles()
    const [value, setValue] = useState("console.log('hello world!');");
    const onChange = useCallback((val: any, viewUpdate: any) => {
        console.log('val:', val);
        setValue(val);
    }, []);
    return <div className={styles["pluginsDemo"]}>
        <div className={styles["pluginsDemoHeader"]}>
            <Alert type={"warning"} message={"说明:插件模块仅作为第三方插件的演示页面，用来梳理整合逻辑和范例，框架本身并不包含这些插件。"}></Alert>
            <Row align={"middle"} style={{ marginTop: theme.marginMD }}>
                <Col span={12}>
                    <span className={styles["pluginsDemoHeaderTitle"]}>代码编辑器(react-codemirror)</span>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button onClick={() => {
                        openDocumentPage("react-codemirror")
                    }} icon={<LinkOutlined></LinkOutlined>}>项目地址</Button>
                </Col>
            </Row>
        </div>
        <div className={styles["pluginsDemoReactQuill"]}>
            <CodeMirror value={value} height="600px" extensions={javascript({ jsx: true, typescript: true })} onChange={onChange} />
        </div>
    </div>
}

function ReactSliderDemo() {
    const { styles, theme } = useStyles()
    const actionRef1 = useRef<ActionType>()
    const actionRef2 = useRef<ActionType>()
    const actionRef3 = useRef<ActionType>()
    const actionRef4 = useRef<ActionType>()
    const offsetXRef = useRef(0)


    return <div className={styles["pluginsDemo"]}>
        <div className={styles["pluginsDemoHeader"]}>
            <Alert type={"warning"} message={"说明:插件模块仅作为第三方插件的演示页面，用来梳理整合逻辑和范例，框架本身并不包含这些插件。"}></Alert>
            <Row align={"middle"} style={{ marginTop: theme.marginMD }}>
                <Col span={12}>
                    <span className={styles["pluginsDemoHeaderTitle"]}>滑块验证(rc-slider-captcha)</span>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button onClick={() => {
                        openDocumentPage("rc-slider-captcha")
                    }} icon={<LinkOutlined></LinkOutlined>}>项目地址</Button>
                </Col>
            </Row>
        </div>
        <div className={styles["pluginsDemoReactQuill"]}>
            <div className={styles["pluginsDemoSlider"]}>
                <div className={styles["pluginsDemoSliderTitle"]}>纯滑块验证</div>
                <SliderCaptcha
                    bgSize={{ width: 384, height: 216 }}
                    mode="slider"
                    tipText={{
                        default: '请按住滑块，拖动到最右边',
                        moving: '请按住滑块，拖动到最右边',
                        error: '验证失败，请重新操作',
                        success: '验证成功'
                    }}
                    errorHoldDuration={1000}
                    onVerify={(data) => {
                        console.log(data);
                        // 默认背景图宽度 320 减去默认拼图宽度 60 所以滑轨宽度是 260
                        if (data.x === 324) {
                            return Promise.resolve();
                        }
                        return Promise.reject();
                    }}
                    actionRef={actionRef1}
                />
                <Button type={"default"} style={{ marginTop: theme.marginSM }} onClick={() => actionRef1.current?.refresh()}>点击重置</Button>
            </div>
            <div className={styles["pluginsDemoSlider"]}>
                <div className={styles["pluginsDemoSliderTitle"]}>拼图验证</div>
                <SliderCaptcha
                    actionRef={actionRef2}
                    showRefreshIcon={true}
                    bgSize={{ width: 384, height: 216 }}
                    tipText={{
                        error: '验证失败，请重新操作',
                        success: '验证成功'
                    }}
                    request={() =>
                        createPuzzle(ImageBg1, {
                            format: 'blob',
                            quality: 1,
                            imageWidth: 384,
                            imageHeight: 216
                        }).then((res) => {
                            offsetXRef.current = res.x
                            return {
                                bgUrl: res.bgUrl,
                                puzzleUrl: res.puzzleUrl
                            }
                        })
                    }
                    onVerify={async (data) => {
                        console.log(data);
                        if (data.x >= offsetXRef.current - 5 && data.x < offsetXRef.current + 5) {
                            return Promise.resolve()
                        }
                        return Promise.reject()
                    }}
                />
                <Button type={"default"} style={{ marginTop: theme.marginSM }} onClick={() => actionRef2.current?.refresh()}>点击重置</Button>
            </div>
            <div className={styles["pluginsDemoSlider"]}>
                <div className={styles["pluginsDemoSliderTitle"]}>触发式拼图验证</div>
                <SliderCaptcha
                    actionRef={actionRef3}
                    mode="float"
                    showRefreshIcon={true}
                    bgSize={{ width: 384, height: 216 }}
                    tipText={{
                        error: '验证失败，请重新操作',
                        success: '验证成功'
                    }}
                    request={() =>
                        createPuzzle(ImageBg1, {
                            format: 'blob',
                            quality: 1,
                            imageWidth: 384,
                            imageHeight: 216
                        }).then((res) => {
                            offsetXRef.current = res.x
                            return {
                                bgUrl: res.bgUrl,
                                puzzleUrl: res.puzzleUrl
                            }
                        })
                    }
                    onVerify={async (data) => {
                        console.log(data);
                        if (data.x >= offsetXRef.current - 5 && data.x < offsetXRef.current + 5) {
                            return Promise.resolve()
                        }
                        return Promise.reject()
                    }}
                />
                <Button type={"default"} style={{ marginTop: theme.marginSM }} onClick={() => actionRef3.current?.refresh()}>点击重置</Button>
            </div>
            <div className={styles["pluginsDemoSlider"]}>
                <div className={styles["pluginsDemoSliderTitle"]}>自定义滑块样式</div>
                <div className={styles["pluginsDemoSliderDescription"]}>你可以尝试切换一下框架的暗色/亮色模式</div>
                <SliderCaptcha
                    className={styles["customSliderDemo"]}
                    bgSize={{ width: 384, height: 216 }}
                    mode="slider"
                    tipText={{
                        default: '请按住滑块，拖动到最右边',
                        moving: '请按住滑块，拖动到最右边',
                        error: '验证失败，请重新操作',
                        success: '验证成功'
                    }}
                    errorHoldDuration={1000}
                    onVerify={(data) => {
                        console.log(data);
                        // 默认背景图宽度 320 减去默认拼图宽度 60 所以滑轨宽度是 260
                        if (data.x === 324) {
                            return Promise.resolve();
                        }
                        return Promise.reject();
                    }}
                    actionRef={actionRef4}
                />
                <Button type={"default"} style={{ marginTop: theme.marginSM }} onClick={() => actionRef4.current?.refresh()}>点击重置</Button>
            </div>
        </div>
    </div>
}

export function PluginsDemo(props: PluginsDemoProps) {

    if (props.pluginName === "react-quill") {
        return <ReactQuillDemo></ReactQuillDemo>
    }
    if (props.pluginName === "react-codemirror") {
        return <ReactCodeMirrorDemo></ReactCodeMirrorDemo>
    }
    if (props.pluginName === 'rc-slider-captcha') {
        return <ReactSliderDemo></ReactSliderDemo>
    }
    return null
}