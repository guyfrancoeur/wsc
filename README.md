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
 - Audio streaming (expérimentale)
 - Video streaming : partage d'écran (application)
 - Formatage du code source avec <kbd>Ctrl</kbd>+<kbd>8</kbd>
 - Insertion et support des émoicons avec <kbd>Windows</kbd>+<kbd>;</kbd>
 - Support des balises html dans les messages
 - Insertion d'image contenu dans le clipboard

### Requis opérationnel
 - Un serveur (similaire a NodeJS) pour le dialogue entre les utilisateurs.


### TODO

+ 3 x slider visuels dans la modale de partage (sharing).
 - [x] a) scale du canvas en fonction de la capture 20% @ 100%  step de 10% ; default 70%
 - [x] b) pureté image (compression jpg) 20% @ 100% step 10% :default 70%
 - [x] c) refresh rate en ms, 100ms @ 2000ms step 100ms : default 500ms
+ [ ] Afficher qui est en mode écriture d'un message.

+ Barre v4
  + [ ] Autoriser le son, video (defaut non, checkbox dans la barre).
  + [ ] Dès que quelqu'un ouvre le micro, sa cam est activé.
  + [x] Enlever le pseudo de l'écran.
  + [ ] Afficher la latence en ms.
+ Mode modérateur
  + [ ] Désactivation micro.
  + [ ] Afficheur de code source en live (avec le formatage couleurs).
  + [ ] Message privé.
  + [ ] Notifier le moderateur lorsque la main est levée (bruit).
+ OSE (fonctionnalité)
  - [ ] Audio
  - [ ] Video
+ [ ] Modale login
+ [ ] Migration vers bootstap 4


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
