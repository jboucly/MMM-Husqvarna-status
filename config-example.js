// Exemple de configuration pour MMM-Husqvarna-Status
// Ajoutez ceci à votre fichier config/config.js dans la section modules

{
    module: "MMM-Husqvarna-Status",
    position: "top_right", // Positions possibles: top_bar, top_left, top_center, top_right, upper_third, middle_center, lower_third, bottom_left, bottom_center, bottom_right, bottom_bar
    config: {
        // CONFIGURATION OBLIGATOIRE
        clientId: "VOTRE_CLIENT_ID_HUSQVARNA", // Obtenez-le sur https://developer.husqvarnagroup.cloud/
        clientSecret: "VOTRE_CLIENT_SECRET_HUSQVARNA", // Obtenez-le sur https://developer.husqvarnagroup.cloud/

        // CONFIGURATION OPTIONNELLE
        updateInterval: 60000, // Intervalle de mise à jour en millisecondes (60000 = 1 minute)
        showDetails: true, // Afficher les détails (batterie, prochaine tonte, etc.)
        animationSpeed: 2000, // Vitesse d'animation du DOM en millisecondes
        mowerModel: "automower", // Modèle de tondeuse (pour futures extensions)

        // La langue sera automatiquement détectée depuis la configuration MagicMirror
        // Langues supportées: "en" (anglais), "fr" (français)
    }
}

// NOTES IMPORTANTES:
// 1. Remplacez "VOTRE_CLIENT_ID_HUSQVARNA" par votre vrai Client ID
// 2. Remplacez "VOTRE_CLIENT_SECRET_HUSQVARNA" par votre vrai Client Secret
// 3. Assurez-vous que votre tondeuse est associée au même compte développeur
// 4. Gardez vos identifiants sécurisés et ne les partagez jamais
