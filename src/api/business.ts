import { get } from "./axios"

export function getPartTree(v) {
    return get("/api/platform/api/public/depart/tree", v)
}