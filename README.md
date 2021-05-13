# wsc

### Un chat (avec video/sharing) sécuritaire super rapide en temps réel

#### Fondation
 - websocket
 - bootstrap
 - jquery

#### Fonctionnalités
 - Visuellement agréable
 - Responsive
 - Rapide
 - Sécuritaire (wss et https)
 - Audio streaming (expérimentale)
 - Video streaming : partage d'écran (application)
 - Formatage du code source avec <kbd>Ctrl</kbd>+<kbd>8</kbd>
 - Insertion et support des émoicons avec <kbd>Windows</kbd>+<kbd>;</kbd>
 - Support des balises html dans les messages
 - Insertion d'image contenu dans le clipboard

### Requis opérationnel
 - Un serveur (similaire à NodeJS) pour le dialogue entre les utilisateurs.

### Réalisations
#### v3.1
+ [x] 3 x slider visuels dans la modale de partage (sharing).
  - [x] a) scale du canvas en fonction de la capture 20% @ 100%  step de 10% ; default 70%;
  - [x] b) pureté image (compression jpg) 20% @ 100% step 10% :default 70%;
  - [x] c) refresh rate en ms, 100ms @ 2000ms step 100ms : default 500ms;
+ [x] Afficher la personne qui est en mode écriture d'un message.
+ [x] Modale login.
+ [x] Changement visuel dans la section base (icons, boite message).
+ [x] Modale qui bouge ou redimensionable.

#### v3.2
+ [x] Amélioration de la fluidité au login
+ [x] Ajout d'un message de sortie de l'application (anti-oups)
+ [x] ajout de la latence en ms
+ [ ] ajout temps login en ms
+ [ ] heure rétractable (collapsable)
+ [x] Migration vers bootstap 4

#### v4.0
+ [ ] multi channel video dynamique (idée)


### Backlog

+ Barre v4
  + [ ] Autoriser le son, video (defaut non, checkbox dans la barre).
  + [ ] Dès que quelqu'un ouvre le micro, sa cam est activé.
  + [x] Enlever le pseudo de l'écran.
+ Mode modérateur
  + [ ] Désactivation micro.
  + [ ] Afficheur de code source en live (avec le formatage couleurs).
  + [ ] Message privé.
  + [ ] Notifier le moderateur lorsque la main est levée (bruit).
+ Gestion des interventions et partage d'écran
  - [ ] Audio
  - [ ] Vidéo
  - [ ] picture in picture
+ [ ] sliders rétractables (collapsable) dans la modale sharing
+ [ ] sharing dans les deux sens (plusieurs sharing en même temps)
+ [ ] partage de code : division de la zone d'affichage avec la zone d'écriture gauche/droite au lieu de haut/bas


### Future



### Expérimentale
 + WebRTC
 + icecast broadcast (pour les gens qui ne veulent pas intervenir dans un cours)
 
### Vérification
 
 + https://httpstatus.io/
 
### Testing 
 
 ```
 $ curl -Is http://www.salutem.co/wsc | head -1
HTTP/1.1 200 OK
```

```
$ curl -Is http://www.salutem.co/wsc/
HTTP/1.1 302 Found
Cache-Control: no-cache
Content-length: 0
Location: https://www.salutem.co/wsc/
```

```
$ curl -Is https://www.salutem.co/wsc/
HTTP/1.1 200 OK
Server: G-WAN
Date: Wed, 23 Dec 2020 13:56:08 GMT
Last-Modified: Mon, 21 Dec 2020 07:15:56 GMT
ETag: "5c05fa-5fe04bac-1153"
Content-Type: text/html
Content-Length: 4435
Content-Encoding: gzip
```

### Intéressant

+ https://blog.logrocket.com/webrtc-over-websocket-in-node-js/
+ https://github.com/node-webrtc/node-webrtc
+ https://github.com/phaux/node-ffmpeg-stream
+ https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
+ https://davidwalsh.name/javascript-pip
