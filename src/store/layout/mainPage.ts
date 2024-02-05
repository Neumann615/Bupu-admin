import { create } from 'zustand'
import defaultSetting from "@/defaultSetting"
import { persist, createJSONStorage } from 'zustand/middleware'
export const useMainPageStore = create(persist((set) => (defaultSetting.mainPage), {
    name: defaultSetting.app.storagePrefix + "mainPage",
    storage: defaultSetting.app.isEnableMemory?(createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)):undefined
}))