# :space_invader: RECREO GAME ENGINE

**Recreo** es un motor de videojuegos creado para el desarrollo de juegos simples con javascript

### Getting Started
Parar iniciar con el desarrollo de tu videojuego puedes descargar los archivos en el el apartado de codigo de el repositorio o clonar el repositorio con el siguiente codigo

```bash
git clone https://github.com/Cesar-CARV/GameEngine.git
mv GameEngine (nombre-de-tu-juego)
```
>[!NOTA]
>
>Para poder probar tu juego es necesario que tengas un servideor de desarrollo, si utilizas visual studio code puedes utilizar ***Live server***

Una vez clonado el repositorio podras ver que hay varias archivos, los documentos que se encuentran en la carpeta GameEngine son todos los archivos que conforman el motor de juegos.

---

En el archivo **main.js** se encunetra la configuracion y creacion de el objeto principal GAME el cual es el encargado de correr el juego.
En este archivo encontraras el siguiente codigo:
```javascript
import Game from './GameEngine/Game.js';
import RoomTest1 from './Rooms/RoomTest1.js';
import RoomTest2 from './Rooms/RoomTest2.js';

// -------------------- GAME SETTINGS --------------------- //
const $game = document.querySelector("#game");
const $gameCanvas = document.querySelector("#game__display");
const GAME = new Game($game, $gameCanvas);
GAME.debug = false; 

// -------------------- ROOMS --------------------- //
GAME.addRoom(RoomTest1);
GAME.addRoom(RoomTest2);
GAME.changeRoom("RoomTest1");
GAME.startGame();

```

Como se puede ver en el codigo anterior estamos importando el los archivos necesario los cuales son la clase Game y los niveles que queremos agregar a nuestro juego y con el metodo `startGame` ponemos en marcha el juego el cual podras visualizar en tu servidor de prueba.

En la carpeta de Objects encontraras la clase **Player** en el cual podras modificar el comportamiento de el mismo, en el metodo `onCreate` podras definir las acciones al crearse el objeto y en el metodo steps definiras las acciones que pasaran en cada vuelta de el ciclo de el juego aqui puedes programar los movimientos y colisiones de el objeto. 

Por ejemplo cambiemos la intensidad de el salto de el Player esta propiedad la encontraras dentro de el contructor con el nombre de "jump"
```javascript
this.jump = -1200;
```

como veras tien el valor de -1200 pero para divertirnos un poco exajeremos un poco este valor a un -3000 y veamos que pasa

```javascript
this.jump = -3000;
```
Ahora preciona la tecla "w" y como puedes apreciar nuestro personaje salta de forma exajerada. Genial no.

Si quieres seguir aprendiendo puedes ver un [tutoriral](#getting-started) o la documentacion [aqui](#)

---

#### Assets
Autor: **Toadzilla**  
[Su pagina de itch.io](https://toadzilla.itch.io/dungeons-pack)
