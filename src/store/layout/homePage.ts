import { create } from 'zustand'
import defaultSetting from "@/defaultSetting"
import { persist, createJSONStorage } from 'zustand/middleware'
export const useHomePageStore = create(persist((set) => (defaultSetting.homePage), {
    name: defaultSetting.app.storagePrefix + "homePage",
    storage: createJSONStorage(() => defaultSetting.app.storageType === "local" ? localStorage : sessionStorage)
}))