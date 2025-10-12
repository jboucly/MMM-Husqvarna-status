const NodeHelper = require('node_helper')
const { OAuth2Api, Oauth2TokenPostGrantTypeEnum } = require('husqvarna-authentication-sdk')
const { MowerApi, Configuration } = require('automower-connect-sdk')

module.exports = NodeHelper.create({
    start() {
        console.log('Starting node helper for: ' + this.name)
        this.authApi = null
        this.mowerApi = null
        this.mowerApiClientId = null
        this.accessToken = null
        this.tokenExpiresAt = null
    },

    async socketNotificationReceived(notification, payload) {
        if (notification === 'GET_MOWER_STATUS') {
            try {
                await this.getMowerStatus(payload)
            } catch (error) {
                console.error('Error getting mower status:', error)
                this.sendSocketNotification('MOWER_ERROR', { error: error.message })
            }
        }
    },

    /**
     * Get mower status by authenticating and fetching data
     */
    async getMowerStatus(config) {
        try {
            // Initialize authentication API if needed
            if (!this.authApi) {
                this.authApi = new OAuth2Api()
            }

            // Check if we need to authenticate or refresh token
            const now = Date.now()
            if (!this.accessToken || (this.tokenExpiresAt && now >= this.tokenExpiresAt)) {
                await this.authenticate(config.clientId, config.clientSecret)
            }

            // Initialize mower API if needed or update headers if token changed
            if (!this.mowerApi || this.mowerApiClientId !== config.clientId) {
                this.mowerApi = new MowerApi(
                    new Configuration({
                        apiKey: config.clientId,
                        baseOptions: {
                            headers: {
                                'Authorization-Provider': 'husqvarna',
                                Authorization: `Bearer ${this.accessToken}`
                            }
                        }
                    })
                )
                this.mowerApiClientId = config.clientId
            } else {
                // Update authorization header with new token
                this.mowerApi.configuration.baseOptions.headers.Authorization = `Bearer ${this.accessToken}`
            }

            // Get mowers list
            const mowersResponse = await this.mowerApi.mowersGet()

            if (!mowersResponse.data.data || mowersResponse.data.data.length === 0) {
                throw new Error('No mowers found in your account')
            }

            // Get the first mower (you can modify this to handle multiple mowers)
            const mower = mowersResponse.data.data[0]
            const mowerId = mower.id

            // Get detailed mower status
            const statusResponse = await this.mowerApi.mowersIdGet({ id: mowerId })

            const mowerData = this.processMowerData(statusResponse.data.data)
            this.sendSocketNotification('MOWER_STATUS_RECEIVED', mowerData)
        } catch (error) {
            console.error('Error in getMowerStatus:', error)
            this.sendSocketNotification('MOWER_ERROR', { error: error.message })
        }
    },

    /**
     * Authenticate with Husqvarna API using client credentials
     */
    async authenticate(clientId, clientSecret) {
        try {
            const response = await this.authApi.oauth2TokenPost({
                clientId: clientId,
                clientSecret: clientSecret,
                grantType: Oauth2TokenPostGrantTypeEnum.CLIENT_CREDENTIALS
            })

            this.accessToken = response.data.access_token
            this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000 // Refresh 1 minute before expiry

            console.log('Successfully authenticated with Husqvarna API')
        } catch (error) {
            console.error('Authentication failed:', error)
            throw new Error('Authentication failed: ' + error.message)
        }
    },

    /**
     * Refresh access token (not needed for client credentials flow)
     */
    async refreshAccessToken() {
        // Client credentials flow doesn't use refresh tokens
        // Just re-authenticate
        console.log('Re-authenticating with client credentials...')
        this.accessToken = null
        this.tokenExpiresAt = null
    },

    /**
     * Process and normalize mower data
     */
    processMowerData(rawData) {
        const processed = {
            id: rawData.id,
            name: rawData.attributes?.system?.name || 'Husqvarna Mower',
            model: rawData.attributes?.system?.model || 'Unknown',
            activity: rawData.attributes?.mower?.activity || 'UNKNOWN',
            state: rawData.attributes?.mower?.state || 'UNKNOWN',
            mode: rawData.attributes?.mower?.mode || 'UNKNOWN',
            batteryPercent: rawData.attributes?.battery?.batteryPercent,
            errorCode: rawData.attributes?.mower?.errorCode || 0,
            errorDescription: rawData.attributes?.mower?.errorCodeTimestamp
                ? this.getErrorDescription(rawData.attributes.mower.errorCode)
                : null,
            lastUpdate: new Date().toISOString()
        }

        // Add next start timestamp if available
        if (rawData.attributes?.planner?.nextStartTimestamp) {
            processed.nextStartTimestamp = rawData.attributes.planner.nextStartTimestamp
        }

        // Add location if available
        if (rawData.attributes?.positions && rawData.attributes.positions.length > 0) {
            const position = rawData.attributes.positions[0]
            processed.location = {
                latitude: position.latitude,
                longitude: position.longitude
            }
        }

        return processed
    },

    /**
     * Get human-readable error description
     */
    getErrorDescription(errorCode) {
        const errorCodes = {
            0: 'No error',
            1: 'Trapped',
            2: 'Lifted',
            3: 'Wheel motor blocked, left',
            4: 'Wheel motor blocked, right',
            5: 'Wheel motor overloaded, left',
            6: 'Wheel motor overloaded, right',
            7: 'Cutting motor blocked',
            8: 'Cutting motor overloaded',
            9: 'Unexpected cutting height adj',
            10: 'Electronic problem',
            11: 'No loop signal',
            12: 'No loop signal',
            13: 'Wrong loop signal',
            14: 'Right loop signal',
            15: 'Central loop signal',
            16: 'Wrong PIN code',
            17: 'Slope too steep',
            18: 'Low battery',
            19: 'Empty battery',
            20: 'No drive',
            21: 'Mower lifted',
            22: 'Lifted',
            23: 'Stuck in charging station',
            24: 'Charging station blocked',
            25: 'Collision sensor problem, rear',
            26: 'Collision sensor problem, front',
            27: 'Wheel motor blocked, rear right',
            28: 'Wheel motor blocked, rear left',
            29: 'Wheel motor overloaded, rear right',
            30: 'Wheel motor overloaded, rear left'
        }

        return errorCodes[errorCode] || `Unknown error (${errorCode})`
    }
})
