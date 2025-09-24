const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    // Generic request handler
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (config.body) {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // User endpoints
    async getProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(updates) {
        return this.request('/users/profile', {
            method: 'PATCH',
            body: updates,
        });
    }

    async getUserActivity() {
        return this.request('/users/activity');
    }

    // Alert endpoints (for future use)
    async getAlerts(limit = 50) {
        return this.request(`/alerts?limit=${limit}`);
    }

    async getAlertStats(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/alerts/stats?${queryString}`);
    }

    async getAlertById(alertId) {
        return this.request(`/alerts/${alertId}`);
    }

    async updateAlertStatus(alertId, status, resolutionNotes = '') {
        return this.request(`/alerts/${alertId}/status`, {
            method: 'PATCH',
            body: { status, resolutionNotes },
        });
    }

    async assignRangerToAlert(alertId, rangerId, notes = '') {
        return this.request(`/alerts/${alertId}/assign`, {
            method: 'PATCH',
            body: { rangerId, notes },
        });
    }

    async getRangers() {
        return this.request('/rangers');
    }

    async updateAlertNotes(alertId, notes) {
        return this.request(`/alerts/${alertId}/status`, {
            method: 'PATCH',
            body: { notes },
        });
    }

}

export default new ApiService();