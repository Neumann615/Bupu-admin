import { create } from 'zustand'
import defaultSetting from "@/defaultSetting"
import { persist, createJSONStorage } from 'zustand/middleware'
export const useMainPageStore = create(persist((set) => (defaultSetting.mainPage), {
    name: defaultSetting.app.storagePrefix + "mainPage",
    storage: createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)
}))