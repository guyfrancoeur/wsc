# wsc

### Un chat sécuritaire super rapide en temps réel qui utilise les websocket, bootstrap et jquery.

- Visuellement agréable
- Responsive
- Rapide
- Sécuritaire (wss et https)
- Audio streaming
- Video streaming : partage d'écran (application)

Quelques suggestions possibles
- émoicons (Windows key + ;)
- html dans les messages
- support de code avec `<pre>`

### Requis opérationnel
 - Un serveur (similaire a NodeJS) pour le dialogue entre les utilisateurs.


### TODO

3 x slider visuels dans la modale de partage (sharing).
 - [ ] a) scale du canvas en fonction de la capture 50% 75% 100% ; default 75%
 - [ ] b) pureté image (compression jpg) 20% @ 100% step 20% :default 80%
 - [ ] c) refresh rate en ms, 200ms @ 2000ms step 50ms : default 500ms

 - (a) scale, je crois que tu as complété ou sur le point de complété.
   + idée comme ca, la modale n'est que le contenant. C'est le canvas que nous redimensionnons.
   + Canvas uniquement utile pour obtenir le uri (jpg)
 - (b) c'est la valeur de .8 que nous avons codé en dure.
 - (c) c'est la valeur du setIntervals codé en dure.
