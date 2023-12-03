import {FloatButton, ColorPicker} from "antd"
import {Icon} from "@/components"
import {useThemeStore, useThemeSettingStore} from "@/store"
import {themeColorList} from "@/utils"
import {useState} from "react"

export function ThemeSetting() {
    const [open, setOpen] = useState(false)

    const themeStore = useThemeStore()
    const themeSettingStore = useThemeSettingStore()
    return themeSettingStore.isEnable ? <FloatButton.Group
        onClick={() => {
            setOpen(!open)
        }}
        tooltip={"主题编辑器"}
        trigger={"click"}
        open={open}
        style={{right: 24}}
        icon={<Icon name={"Theme"}/>}
    >
        {themeSettingStore.isEnableThemeColor ?
            <FloatButton tooltip={<div>自定义主题色</div>}
                         icon={<ColorPicker
                             onChange={(v: any) => {
                                 useThemeStore.setState({themeColor: v.metaColor.originalInput})
                             }}
                             arrow={false}
                             default={themeStore.themeColor}
                             placement={"left"}
                             presets={[
                                 {
                                     colors: themeColorList
                                 }]}
                             children={<Icon name={"Platte"}/>}></ColorPicker>}></FloatButton> : null}
        {themeSettingStore.isEnableDarkMode ?
            <FloatButton
                tooltip={<div>暗黑模式</div>}
                type={themeStore.darkMode ? "primary" : "default"}
                onClick={() => {
                    useThemeStore.setState({darkMode: !themeStore.darkMode})
                }} icon={<Icon name={"Moon"}/>}/> : null}
        {themeSettingStore.isEnableCompactMode ?
            <FloatButton
                tooltip={<div>紧凑模式</div>}
                type={themeStore.compactMode ? "primary" : "default"}
                onClick={() => {
                    useThemeStore.setState({compactMode: !themeStore.compactMode})
                }} icon={<Icon name={"OverallReduction"}/>}/>
            : null}
        {themeSettingStore.isEnableHappyEffect ?
            <FloatButton
                tooltip={<div>{"快乐工作特效" + (themeStore.happyEffect ? "关闭" : "开启")}</div>}
                type={themeStore.happyEffect ? "primary" : "default"} onClick={() => {
                useThemeStore.setState({happyEffect: !themeStore.happyEffect})
            }}
                icon={<Icon name={"SmilingFaceWithSquintingEyes"}/>}/> : null}
    </FloatButton.Group> : null
}