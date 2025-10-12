# MMM-Husqvarna-Status

Un module MagicMirror² pour afficher le statut de votre tondeuse robot Husqvarna Automower avec des animations visuelles.

![Husqvarna Status Module](screenshot.png)

## Fonctionnalités

- 🚜 **Affichage animé** : Visualisation de votre tondeuse avec des animations selon son état
- 🔋 **Informations détaillées** : Batterie, prochaine tonte, dernière mise à jour
- 🌍 **Multilingue** : Support français et anglais
- ⚡ **Temps réel** : Mise à jour automatique du statut
- 🎨 **Animations contextuelles** :
    - **Tonte** : Animation de mouvement avec lame rotative
    - **Charge** : Pulsation avec icône éclair
    - **Attente/Parking** : Animation de "respiration" avec icône sommeil
    - **Erreur** : Animation de tremblement avec icône d'alerte

## Prérequis

1. **Compte Développeur Husqvarna** : Vous devez créer une application sur le portail développeur Husqvarna
2. **Client ID et Client Secret** : Vous devez obtenir ces identifiants depuis le portail développeur Husqvarna
3. **MagicMirror²** version 2.1.0 ou supérieure

## Installation

1. Naviguez vers le dossier des modules de MagicMirror :

```bash
cd ~/MagicMirror/modules
```

2. Clonez ce repository :

```bash
git clone https://github.com/jboucly/MMM-Husqvarna-status.git
```

3. Naviguez vers le dossier du module :

```bash
cd MMM-Husqvarna-status
```

4. Installez les dépendances :

```bash
npm install
```

5. **(Optionnel) Testez votre configuration API :**

```bash
pnpm test VOTRE_CLIENT_ID VOTRE_CLIENT_SECRET
```

Ce script vous aidera à vérifier que vos identifiants fonctionnent correctement.

## Obtenir les identifiants Husqvarna

1. Rendez-vous sur [Husqvarna Developer Portal](https://developer.husqvarnagroup.cloud/)
2. Créez un compte ou connectez-vous
3. Créez une nouvelle application
4. Notez votre **Client ID** et **Client Secret**
5. Assurez-vous que votre tondeuse est associée à votre compte Husqvarna Connect

## Configuration

Ajoutez le module à votre fichier `config/config.js` :

```javascript
{
    module: "MMM-Husqvarna-Status",
    position: "top_right", // ou toute autre position
    config: {
        clientId: "VOTRE_CLIENT_ID_ICI",
        clientSecret: "VOTRE_CLIENT_SECRET_ICI",
        updateInterval: 60000, // 1 minute (optionnel)
        showDetails: true, // Afficher les détails (optionnel)
        animationSpeed: 2000, // Vitesse d'animation (optionnel)
        mowerModel: "automower" // Modèle de tondeuse (optionnel)
    }
}
```

### Options de configuration

| Option           | Type      | Défaut        | Description                                            |
| ---------------- | --------- | ------------- | ------------------------------------------------------ |
| `clientId`       | `string`  | **REQUIS**    | Votre Client ID Husqvarna                              |
| `clientSecret`   | `string`  | **REQUIS**    | Votre Client Secret Husqvarna                          |
| `updateInterval` | `number`  | `60000`       | Intervalle de mise à jour en millisecondes             |
| `showDetails`    | `boolean` | `true`        | Afficher les détails (batterie, prochaine tonte, etc.) |
| `animationSpeed` | `number`  | `2000`        | Vitesse d'animation du DOM en millisecondes            |
| `mowerModel`     | `string`  | `"automower"` | Modèle de tondeuse (pour futures extensions)           |

## États supportés

Le module affiche différentes animations selon l'état de votre tondeuse :

### 🚜 **Tonte (MOWING)**

- Animation de mouvement latéral
- Lame rotative rouge
- Couleur verte vive

### ⚡ **Charge (CHARGING)**

- Animation de pulsation
- Icône éclair clignotante
- Couleur ambre

### 💤 **Parking/Attente (PARKED)**

- Animation de "respiration" douce
- Icône sommeil flottante
- Couleur grise

### ⚠️ **Erreur (ERROR)**

- Animation de tremblement
- Icône d'alerte clignotante
- Couleur rouge
- Affichage du message d'erreur

## Codes d'erreur supportés

Le module traduit automatiquement les codes d'erreur Husqvarna en messages lisibles :

- **0** : Aucune erreur
- **1** : Coincé
- **2** : Soulevé
- **3-6** : Problèmes moteur roues
- **7-8** : Problèmes moteur de coupe
- **10** : Problème électronique
- **11-15** : Problèmes signal de boucle
- **17** : Pente trop raide
- **18-19** : Problèmes batterie
- Et bien d'autres...

## Dépannage

### Erreur d'authentification

- Vérifiez que votre `apiKey`, `username` et `password` sont corrects
- Assurez-vous que votre compte Husqvarna Connect fonctionne
- Vérifiez que votre API Key est active

### Aucune tondeuse trouvée

- Assurez-vous que votre tondeuse est bien associée à votre compte Husqvarna Connect
- Vérifiez que votre tondeuse est connectée et en ligne

### Problèmes de réseau

- Vérifiez votre connexion internet
- Les serveurs Husqvarna peuvent parfois être indisponibles

### Logs de débogage

Consultez les logs de MagicMirror pour plus d'informations :

```bash
npm start dev
```

## Structure des fichiers

```
MMM-Husqvarna-status/
├── MMM-Husqvarna-Status.js     # Module principal
├── node_helper.js              # Helper Node.js pour API
├── MMM-Husqvarna-Status.css    # Styles et animations
├── translations/
│   ├── en.json                 # Traductions anglaises
│   └── fr.json                 # Traductions françaises
├── package.json                # Dépendances
└── README.md                   # Cette documentation
```

## API Husqvarna

Ce module utilise :

- `husqvarna-authentication-sdk` pour l'authentification
- `automower-connect-sdk` pour récupérer les données de la tondeuse

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Ajouter de nouvelles traductions

## Licence

MIT License - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

## Remerciements

- [MagicMirror²](https://github.com/MichMich/MagicMirror) pour le framework
- [Husqvarna Group](https://developer.husqvarnagroup.cloud/) pour l'API
- La communauté MagicMirror pour l'inspiration

---

**Note** : Ce module n'est pas officiel et n'est pas affilié à Husqvarna Group. Utilisez-le à vos propres risques.
