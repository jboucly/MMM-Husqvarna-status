// Example configuration for MMM-Husqvarna-Status
// Add this to your config/config.js file inside the modules array

{
    module: "MMM-Husqvarna-Status",
    position: "top_right", // Possible positions: top_bar, top_left, top_center, top_right, upper_third, middle_center, lower_third, bottom_left, bottom_center, bottom_right, bottom_bar
    config: {
        // REQUIRED CONFIGURATION
        clientId: "YOUR_CLIENT_ID_HUSQVARNA", // Obtain it from https://developer.husqvarnagroup.cloud/
        clientSecret: "YOUR_CLIENT_SECRET_HUSQVARNA", // Obtain it from https://developer.husqvarnagroup.cloud/

        // OPTIONAL CONFIGURATION
        updateInterval: 60000, // Update interval in milliseconds (60000 = 1 minute)
        showDetails: true, // Show details (battery, next mow, etc.)
        animationSpeed: 2000, // DOM animation speed in milliseconds

        showName: true, // Show mower name
        showCycles: true, // Show number of charging cycles
        showBattery: true, // Show battery percentage
        showCuttingTime: true, // Show total cutting time
        showCollisions: true, // Show number of collisions
        showNextStart: true // Show next start time
    }
}

// IMPORTANT NOTES:
// 1. Replace "VOTRE_CLIENT_ID_HUSQVARNA" with your actual Client ID
// 2. Replace "VOTRE_CLIENT_SECRET_HUSQVARNA" with your actual Client Secret
// 3. Ensure your mower is linked to the same Husqvarna developer account
// 4. Keep your credentials secure and never share them
