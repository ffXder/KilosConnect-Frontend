const API_URL = '/api'

export const inventoryService  = {
    async fetchAll() {
        const res = await fetch(`${API_URL}/inventory/summary`)
        return res.json();
    },

    async getAllAsset() {
        return fetch(`${API_URL}`)
    }
}