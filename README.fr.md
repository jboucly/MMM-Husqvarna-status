# MMM-Husqvarna-Status

Un module MagicMirror² pour afficher le statut de votre tondeuse robot Husqvarna Automower avec des animations visuelles.

[![Example](screenshots/example.gif)](screenshots/example.gif)

🇬🇧 An English version of this README is available: see `README.md`.

[Voir la version anglaise / See English version](README.md)

---

## Fonctionnalités

- Visualisation animée de la tondeuse (animations selon l'état)
- Batterie, prochaine tonte, temps de coupe total et autres statistiques
- Multilingue (français et anglais)
- Interrogation automatique de l'API Husqvarna Automower

Voir des exemples dans [STATUS_EXAMPLE.md](STATUS_EXAMPLE.md)

## Prérequis

1. Compte développeur Husqvarna et application enregistrée sur le portail développeur
2. Client ID et Client Secret fournis par Husqvarna
3. MagicMirror²

## Installation

1. Allez dans le dossier des modules de MagicMirror :

```bash
cd ~/MagicMirror/modules
```

2. Clonez le dépôt :

```bash
git clone https://github.com/jboucly/MMM-Husqvarna-status.git
```

3. Installez les dépendances :

```bash
npm install
```

## Configuration

Ajoutez le module à votre `config/config.js` :

Vous avez la possibilité de copier / coller ce fichier avec toutes les infos : [config-example.js](config-example.js)

```javascript
{
    module: "MMM-Husqvarna-Status",
    position: "middle_center",
    config: {
        // REQUIRED CONFIGURATION
        clientId: "your-client-id-here",
        clientSecret: "your-client-secret-here",

        // OPTIONAL CONFIGURATION
        updateInterval: 60000,
        showDetails: true,
        animationSpeed: 2000,

        showName: true,
        showCycles: true,
        showBattery: true,
        showCuttingTime: true,
        showCollisions: true,
        showNextStart: true
    }
}
```

### Options

| Options         | Required | Type      | Default | Description                                                                                                     |
| --------------- | -------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| clientId        | ✅       | `string`  | null    | Client id de votre application Husqvarna. Vous pouvez l'obtenir sur https://developer.husqvarnagroup.cloud/     |
| clientSecret    | ✅       | `string`  | null    | Client secret de votre application Husqvarna. Vous pouvez l'obtenir sur https://developer.husqvarnagroup.cloud/ |
| updateInterval  | ❌       | `number`  | 60000   | Intervalle pour mettre à jour l'état. Par défaut `60000ms` = 1 min                                              |
| animationSpeed  | ❌       | `number`  | 2000    | Vitesse de l'animation de la tondeuse. Par défaut `2000ms`                                                      |
| showDetails     | ❌       | `boolean` | true    | Afficher les détails de la tondeuse                                                                             |
| showName        | ❌       | `boolean` | true    | Afficher le nom de votre tondeuse                                                                               |
| showCycles      | ❌       | `boolean` | true    | Afficher le nombre de cycles de charge de la batterie de votre tondeuse                                         |
| showBattery     | ❌       | `boolean` | true    | Afficher le pourcentage de batterie                                                                             |
| showCuttingTime | ❌       | `boolean` | true    | Afficher le temps de coupe                                                                                      |
| showCollisions  | ❌       | `boolean` | true    | Afficher le nombre de collisions                                                                                |
| showNextStart   | ❌       | `boolean` | true    | Afficher la date ou l'heure de la prochaine démarre de votre tondeuse                                           |

## Utilisation

Redémarrez MagicMirror après la configuration. Le module s'authentifie auprès de Husqvarna et affiche les données de la tondeuse. Lancez MagicMirror en mode dev pour voir les logs.

## États et animations

- TONTE (MOWING) : Tondeuse en mouvement latéral + herbes
- CHARGE (CHARGING) : Tondeuse animée en charge + icône éclair
- GARÉ (PARKED) : Tondeuse animée en mode sommeil + icônes Z
- RETOUR BASE (GOING_HOME) : Tondeuse animée en route vers la station de charge + icône maison
- LEAVING : Tondeuse animée en déplacement
- ERROR : Tondeuse inanimée entourée d'un carré rouge

## Dépannage

- Problèmes d'authentification : vérifiez Client ID / Client Secret
- Aucune tondeuse trouvée : vérifiez l'association de la tondeuse au compte
- Problèmes réseau : vérifiez la connexion et la disponibilité de l'API Husqvarna
- Logs : lancez MagicMirror en mode dev et inspectez la console

```bash
npm start:dev
```

## API

Ce module utilise `husqvarna-authentication-sdk` pour l'authentification et `automower-connect-sdk` pour récupérer les données.

- [automower-connect-sdk](https://www.npmjs.com/package/automower-connect-sdk)
- [husqvarna-authentication-sdk](https://www.npmjs.com/package/husqvarna-authentication-sdk)

Vous pouvez consulter le code source [ici](https://github.com/jboucly/husqvarna-sdk-generator) pour plus de détail.

## Contribution

Les contributions sont les bienvenues — ouvrez des issues ou des PR sur GitHub.

## Licence

MIT
