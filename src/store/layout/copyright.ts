import { create } from 'zustand'
import defaultSetting from "@/defaultSetting"

export const useCopyrightStore: any = create((set: any) => (defaultSetting.copyright))