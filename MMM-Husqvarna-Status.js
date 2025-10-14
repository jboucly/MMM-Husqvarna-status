Module.register('MMM-Husqvarna-Status', {
    defaults: {
        clientId: '',
        clientSecret: '',
        showDetails: true,
        animationSpeed: 2000,
        updateInterval: 60000, // 1 minute

        // Cards info
        showName: true,
        showCycles: true,
        showBattery: true,
        showCuttingTime: true,
        showCollisions: true,
        showNextStart: true
    },

    // Current mower data
    mowerData: null,
    updateTimer: null,

    requiresVersion: '2.1.0',

    getStyles() {
        return [
            this.file('styles/home.css'),
            this.file('styles/sleep.css'),
            this.file('styles/mowing.css'),
            this.file('styles/leaving.css'),
            this.file('styles/charging.css'),
            this.file('styles/MMM-Husqvarna-Status.css')
        ]
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
            fr: 'translations/fr.json'
        }
    },

    start() {
        Log.info('Starting module : ' + this.name)

        // Validate required config
        if (!this.config.clientId || !this.config.clientSecret) {
            Log.error(this.name + ' : Missing required configuration (clientId, clientSecret)')
            return
        }

        this.mowerData = null
        this.scheduleUpdate()
    },

    /**
     * Schedule the next update
     */
    scheduleUpdate() {
        clearTimeout(this.updateTimer)
        this.getMowerStatus()
        this.updateTimer = setTimeout(() => {
            this.scheduleUpdate()
        }, this.config.updateInterval)
    },

    /**
     * Request mower status from node helper
     */
    getMowerStatus() {
        this.sendSocketNotification('GET_MOWER_STATUS', {
            clientId: this.config.clientId,
            clientSecret: this.config.clientSecret
        })
    },

    /**
     * Handle notifications received by the node helper.
     */
    socketNotificationReceived(notification, payload) {
        switch (notification) {
            case 'MOWER_STATUS_RECEIVED':
                this.mowerData = payload
                this.updateDom(this.config.animationSpeed)
                break
            case 'MOWER_ERROR':
                Log.error(this.name + ': ' + payload.error)
                this.mowerData = { error: payload.error }
                this.updateDom(this.config.animationSpeed)
                break
        }
    },

    /**
     * Render the module
     */
    getDom() {
        const wrapper = document.createElement('div')
        wrapper.className = 'husqvarna-status'

        if (!this.mowerData) {
            wrapper.innerHTML = this.translate('LOADING')
            wrapper.className += ' loading'
            return wrapper
        }

        if (this.mowerData.error) {
            wrapper.innerHTML = `<div class="error">${this.translate('ERROR')}: ${this.mowerData.error}</div>`
            return wrapper
        }

        // Create mower visual representation
        const mowerContainer = document.createElement('div')
        mowerContainer.className = 'mower-container'

        const mowerIcon = document.createElement('div')
        mowerIcon.className = `mower-icon ${this.getMowerStateClass()}`
        mowerIcon.innerHTML = this.getMowerIcon()

        const statusText = document.createElement('div')
        statusText.className = 'status-text'
        statusText.innerHTML = this.getStatusText()

        mowerContainer.appendChild(mowerIcon)
        mowerContainer.appendChild(statusText)

        if (this.config.showDetails) {
            const details = document.createElement('div')
            details.className = 'details'
            details.innerHTML = this.getDetailsHTML()
            mowerContainer.appendChild(details)
        }

        wrapper.appendChild(mowerContainer)
        return wrapper
    },

    /**
     * Get CSS class based on mower state
     */
    getMowerStateClass() {
        if (!this.mowerData || !this.mowerData.activity) return 'unknown'

        const activity = this.mowerData.activity.toLowerCase()
        Log.info('MMM-Husqvarna-Status: Activity received :', this.mowerData.activity)
        Log.info('MMM-Husqvarna-Status: Activity lowercased :', activity)

        if (activity.includes('mowing')) return 'mowing'
        if (activity.includes('going_home')) return 'going-home'
        if (activity.includes('leaving')) return 'leaving'
        if (activity.includes('charging')) return 'charging'
        if (activity.includes('parked') || activity.includes('waiting')) return 'parked'
        if (activity.includes('error') || activity.includes('stuck')) return 'error'

        Log.info('MMM-Husqvarna-Status: Unknown activity, returning unknown')
        return 'unknown'
    },

    /**
     * Get mower icon (Realistic design inspired by Husqvarna mower)
     */
    getMowerIcon() {
        return `
            <svg viewBox="0 0 120 100" class="mower-svg">
                <!-- Main body - turquoise rounded rectangular -->
                <rect x="25" y="45" width="70" height="30" rx="15" ry="15" class="mower-body"/>

                <!-- Hood -->
                <rect x="35" y="35" width="50" height="20" rx="10" ry="10" class="mower-hood"/>

                <!-- Top orange panel -->
                <rect x="45" y="30" width="30" height="15" rx="5" ry="5" class="mower-panel"/>

                <!-- Left main wheel -->
                <circle cx="25" cy="70" r="12" class="main-wheel" fill="#333" stroke="#000" stroke-width="2"/>
                <circle cx="25" cy="70" r="8" class="wheel-inner" fill="#666"/>
                <circle cx="25" cy="70" r="3" class="wheel-center" fill="#999"/>

                <!-- Right rear wheel -->
                <circle cx="95" cy="70" r="6" class="rear-wheel" fill="#333" stroke="#000" stroke-width="1"/>                <!-- LED de statut -->
                <circle cx="60" cy="42" r="2" class="status-led"/>

                <!-- Cutting area (invisible by default) -->
                <g class="cutting-area">
                    <ellipse cx="60" cy="85" rx="45" ry="8" class="cutting-zone"/>

                    <!-- Realistic grass blades under the mower -->
                    <g class="grass" style="opacity: 0;">
                        <!-- Blade 1 -->
                        <path d="M35,85 Q36,82 37,80 Q38,78 39,77 Q40,76 41,77 Q42,78 43,80 Q44,82 45,85"
                            class="grass-blade" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round"/>
                        <!-- Blade 2 -->
                        <path d="M45,88 Q46,85 47,83 Q48,81 49,80 Q50,79 51,80 Q52,81 53,83 Q54,85 55,88"
                            class="grass-blade" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round"/>
                        <!-- Blade 3 -->
                        <path d="M55,86 Q56,83 57,81 Q58,79 59,78 Q60,77 61,78 Q62,79 63,81 Q64,83 65,86"
                            class="grass-blade" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round"/>
                        <!-- Blade 4 -->
                        <path d="M65,89 Q66,86 67,84 Q68,82 69,81 Q70,80 71,81 Q72,82 73,84 Q74,86 75,89"
                            class="grass-blade" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round"/>
                        <!-- Blade 5 -->
                        <path d="M75,87 Q76,84 77,82 Q78,80 79,79 Q80,78 81,79 Q82,80 83,82 Q84,84 85,87"
                            class="grass-blade" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round"/>
                    </g>
                </g>

                <!-- Home icon (for return to station) -->
                <g class="home-icon" transform="translate(85, 15)">
                    <!-- Roof -->
                    <polygon points="0,8 8,0 16,8" class="house-roof" fill="#d32f2f"/>
                    <!-- Body -->
                    <rect x="2" y="8" width="12" height="10" class="house-body" fill="#f5f5f5"/>
                    <!-- Door -->
                    <rect x="6" y="12" width="4" height="6" class="house-door" fill="#8d6e63"/>
                </g>

                <!-- Charging icon -->
                <g class="charging-icon">
                    <polygon points="1,0 7,0 5,5 9,5 2,12 4,7 0,7" fill="#ffc107" class="lightning"/>
                    <polygon points="2,1 6,1 4.5,4 7.5,4 3,10 4,6 1,6" fill="#ffeb3b" class="lightning"/>
                </g>

                <!-- Sleep icon -->
                <g class="sleep-icon" style="opacity: 0;">
                    <text x="75" y="25" class="sleep-z">Z</text>
                    <text x="80" y="20" class="sleep-z sleep-z2">z</text>
                    <text x="85" y="15" class="sleep-z sleep-z3">z</text>
                </g>
            </svg>
        `
    },

    /**
     * Get status text based on mower state
     */
    getStatusText() {
        if (!this.mowerData) return this.translate('LOADING')

        if (this.mowerData.errorCode && this.mowerData.errorCode !== 0) {
            return `${this.translate('ERROR')}: ${this.translate('ERROR_' + this.mowerData.errorCode) || this.mowerData.errorDescription || 'Unknown error'}`
        }

        const activity = this.mowerData.activity
        return this.translate('STATUS_' + activity.toUpperCase()) || activity
    },

    /**
     * Get details HTML
     */
    getDetailsHTML() {
        if (!this.mowerData) return ''

        let details = '<div class="details-grid">'

        if (this.config.showName && this.mowerData.name !== undefined && this.mowerData.model !== undefined) {
            details += `<div class="detail-card info-card">
                <div class="card-icon">🤖</div>
                <div class="card-content">
                    <div class="card-title">${this.mowerData.name}</div>
                    <div class="card-subtitle">${this.mowerData.model}</div>
                </div>
            </div>`
        }

        if (this.config.showBattery && this.mowerData.batteryPercent !== undefined) {
            const batteryLevel = this.mowerData.batteryPercent
            const batteryIcon =
                batteryLevel > 80 ? '🔋' : batteryLevel > 50 ? '🪫' : batteryLevel > 20 ? '⚠️🪫' : '❌🪫'
            details += `<div class="detail-card battery-card">
                <div class="card-icon">${batteryIcon}</div>
                <div class="card-content">
                    <div class="card-title">${batteryLevel}%</div>
                    <div class="card-subtitle">${this.translate('BATTERY')}</div>
                </div>
            </div>`
        }

        if (this.config.showCycles && this.mowerData.totalCycles !== undefined) {
            details += `<div class="detail-card cycles-card">
                <div class="card-icon">🔄</div>
                <div class="card-content">
                    <div class="card-title">${this.mowerData.totalCycles}</div>
                    <div class="card-subtitle">${this.translate('CHARGING_CYCLES')}</div>
                </div>
            </div>`
        }

        if (this.config.showCuttingTime && this.mowerData.totalCuttingTime !== undefined) {
            const hours = Math.round((this.mowerData.totalCuttingTime || 0) / 3600)
            details += `<div class="detail-card time-card">
                <div class="card-icon">⏱️</div>
                <div class="card-content">
                    <div class="card-title">${hours}h</div>
                    <div class="card-subtitle">${this.translate('TOTAL_CUTTING_TIME')}</div>
                </div>
            </div>`
        }

        if (this.config.showCollisions && this.mowerData.numberOfCollisions !== undefined) {
            details += `<div class="detail-card collision-card">
                <div class="card-icon">💥</div>
                <div class="card-content">
                    <div class="card-title">${this.mowerData.numberOfCollisions}</div>
                    <div class="card-subtitle">${this.translate('NUMBER_OF_COLLISIONS')}</div>
                </div>
            </div>`
        }

        if (this.config.showNextStart && this.mowerData.nextStartTimestamp) {
            const nextStart = new Date(this.mowerData.nextStartTimestamp)
            const timeString = nextStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            details += `<div class="detail-card schedule-card">
                <div class="card-icon">📅</div>
                <div class="card-content">
                    <div class="card-title">${timeString}</div>
                    <div class="card-subtitle">${this.translate('NEXT_START')}</div>
                </div>
            </div>`
        }

        details += '</div>'
        return details
    },

    /**
     * Handle suspend
     */
    suspend() {
        clearTimeout(this.updateTimer)
    },

    /**
     * Handle resume
     */
    resume() {
        this.scheduleUpdate()
    }
})
