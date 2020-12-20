# wsc

### Un chat sécuritaire super rapide en temps réel

#### Fondation
 - websocket
 - bootstrap
 - jquery

#### Fonctionnalités
 - Visuellement agréable
 - Responsive
 - Rapide
 - Sécuritaire (wss et https)
 - Audio streaming
 - Video streaming : partage d'écran (application)
 - Formatage du code source avec <kbd>Ctrl</kbd>+<kbd>8</kbd>
 - Insertion et support des émoicons avec <kbd>Windows</kbd>+<kbd>;</kbd>
 - Support des balises html dans les messages
 - Insertion d'image contenu dans le clipboard

### Requis opérationnel
 - Un serveur (similaire a NodeJS) pour le dialogue entre les utilisateurs.


### TODO

+ 3 x slider visuels dans la modale de partage (sharing).
 - [ ] a) scale du canvas en fonction de la capture 20% @ 100%  step de 10% ; default 70%
 - [ ] b) pureté image (compression jpg) 20% @ 100% step 10% :default 80%
 - [ ] c) refresh rate en ms, 100ms @ 2000ms step 100ms : default 500ms
+ [ ] Afficheur de code source en live (avec le formatage couleurs).
+ OSE
  - [ ] Audio
  - [ ] Video (
+ [ ] Afficheur de typing.
+ [ ] Son (bruit) pour la main levé.
+ [ ] Autoriser le son, video (defaut oui avec un checkbox).
+ [ ] Dès que quelqu'un a le micro ouvert la cam est activé.

### Expérimentale
 + WebRTC
 + icecast broadcast (pour les gens qui ne veulent pas intervenir dans un cours)
