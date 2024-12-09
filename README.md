# :space_invader: RECREO GAME ENGINE

**Recreo** es un motor de videojuegos creado para el desarrollo de juegos simples con javascript

>[Nota]
>
>El motor aun esta en desarrollo, para usarlo de forma segura esperar minimo a la version 1.0.0

## Cambios hechos en la version 0.2.0
Se hicieron cambios en el funcionamiento del `Time` y de `Input` para que se pueda tener mas de una instancia de la clase `GAME` en la misma pagina.

## Getting Started
Parar iniciar con el desarrollo de tu videojuego puedes utilizar el siguiente comando para instalar el motor en tu proyecto web.

```bash
npm i recreo
```

si no quieres descargar ningun archivo puedes utilizar el CDN en tu codigo para importar los archivos. Ejemplo:

```JavaScript
import {
  Game
} from 'https://cdn.jsdelivr.net/npm/recreo@0.2.0/dist/recreo.js';
```
>[!NOTA]
>
>Para poder probar tu juego es necesario que tengas un servideor de desarrollo, si utilizas visual studio code puedes utilizar ***Live server***

## Configuracion
Una vez instalado todo lo necesario hay que agregar el siguiente codigo HTML a tu pagina o componente.

```HTML
<!-- Game HMTL -->
<div class="game-container">
  <div id="game">
    <canvas tabindex="1" id="game__display"></canvas>
  </div>
</div>
<!-- End Game HTML -->
```

acompañado de los siguientes estilos (opcionales)

```CSS
/*OPCIONALES*/
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  background-color: #222;
}

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-color: black;
}
/*FIN OPCIONALES*/

#game {
  position: relative;
  overflow: hidden;
  width: 100%;
}

#game__display {
  margin: 0;
  padding: 0;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: solid 1px;
  image-rendering: auto;
  background-color: #222;
}

#game__display:focus,
#game__display:active {
  outline: none;
}
```

## Primeros pasos

Para irnos familiarizando un poco con el motor crearemos un pequeño cuadrado que se movera a con las teclas w,a,s,d ademas de un boton que pausara el juego, para esto tendremos que **importar** los archivos necesario de la siguiente manera:

```JavaScript
import {Game, Room, ObjectNode, Vector2, UIButton} from 'recreo';
```

en caso de que hayas utilizado el CDN seria de la siguiente manera:
```JavaScript
import {
  Room,
  Game,
  ObjectNode,
  Vector2,
  UIButton,
} from "https://cdn.jsdelivr.net/npm/recreo@0.2.0/dist/recreo.js";
```

## Crear nuestra primer clase player
Ahora lo que haremos sera crear nuestra primera clase el cual sera nuestro pequeño personaje, para esto crearemos una clase que herede de `ObjectNode`.
La clase ObjectNode resive 5 parametros los cuales son `GAME` que es la instancia de el juego, `x` que es su posicion en horizontal, `y` la posicion en vertical, `w` el ancho y `h` el alto .

```JavaScript
class Player extends ObjectNode {
  constructor(GAME, x, y, w, h) {
    super(GAME, x, y, w, h);
  }
}
```

Dentro de nuestro contructor crearemos nuestra siguiente propiedad `this.velocity = new Vector2(0, 0);`.

Como queremos que nuestro personaje se dibuje en pantalla utilizaremos el metodo `draw` el cual resive como parametro `ctx` (CanvasRenderingContext2D), dentro de el metodo escribiremos el siguiente codigo.

```JavaScript
ctx.fillStyle = "#d57";
ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
```

despues crearemos el movimiento de nuestro personaje dentro de el metodo `steps` ya que este metodo recibe como parametro el deltaTime. Para esto se hara uso de el metodo `GetKeyPress` el cual se encuentra en `GAME` en la pripiedad `input` y para poder acceder a el utilizaremos nuestra propiedad `_GAME`. El metodo `GetKeyPress` resive como parametro la tecla que queremos detectar.

```JavaScript
// velocidad horizontal
this.velocity.x =
  (this._GAME.input.GetKeyPress("d") - this._GAME.input.GetKeyPress("a")) * 400 * deltaTime;
this.velocity.y =
  (this._GAME.input.GetKeyPress("s") - this._GAME.input.GetKeyPress("w")) * 400 * deltaTime;

// mover
this.position = this.position.Sum(this.velocity);
```

Al final nuestra clase quedaria de la siguiete manera:

```JavaScript
class Player extends ObjectNode {
  constructor(GAME, x, y, w, h) {
    super(GAME, x, y, w, h);
    this.velocity = new Vector2(0, 0);
  }

  draw = (ctx) => {
    ctx.fillStyle = "#d57";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  };

  steps = (deltaTime) => {
    // velocidad horizontal
    this.velocity.x =
      (this._GAME.input.GetKeyPress("d") - this._GAME.input.GetKeyPress("a")) * 400 * deltaTime;
    // velocidad vertical
    this.velocity.y =
      (this._GAME.input.GetKeyPress("s") - this._GAME.input.GetKeyPress("w")) * 400 * deltaTime;

    // mover
    this.position = this.position.Sum(this.velocity);
  };
}
```
## Creando el boton de pausa

Para el boton de pausa seguiremos el mismo pincipio que con la clase anterior, crearemos una clase que herede de `UIButton` el cual resive como parametros `GAME` que es la instancia de el juego, `x` que es su posicion en horizontal, `y` la posicion en vertical, `w` el ancho, `h` el alto y por ultimo `text` el cual sera el texto que mostrara el boton.

Dentro de el metodo `onClick` que como su nombre indica se ejecuta cuando se hace click sobre el boton, escribiremos la funcionalidad

```JavaScript
class PauseButton extends UIButton {
  constructor(GAME, x, y) {
    super(GAME, x, y, 100, 50, "PAUSE");
  }

  onClick = () => {
    if (this._GAME.gamePaused) {
      this._GAME.playGame();
      this.text = "PAUSE";
    } else {
      this._GAME.pauseGame();
      this.text = "PLAY";
    }
  };
}
```

## Creando nuestro primer nivel (Room)

Ahora ya que creamos nuestras clases que utilizaremos necesitamos un nivel en el cual poder crear instancias de nuestras clases, para esto haremos una clase que herede de `Room` en este caso la llamaremos RoomTest1, la clase `Room` solo recibe un parametro el cual es `GAME`.

Para crear las instancias de nuestras clases tendremos que hacerlo dentro de el constructor de la calse de la siguiente manera:

```JavaScript
class RoomTest1 extends Room {
  constructor(GAME) {
    super(GAME);

    const player = new Player(this._GAME, 0, 0, 50, 50);

    const button = new PauseButton(this._GAME, this._GAME.viewport.x - 110, 10);

    this.addInstance(player, false, "player");
    this.addInstance(button, true, "button");
  }
}
```

El metodo `addInstance` resive 3 parametros, `inst` el cual es la instancia/objeto que vamos a agregar, `UI` este parametro es para indicar si es un elemento de la interfaz y por ultimo `name` el cual es el nombre con el que se agregara al listado de instancias de el nivel 

## Creando GAME

Una vez creado nuestras clases y niveles podremos crear nuestra instancia de `GAME`. Esta clase acepta 4 parametros los cuales son `game` que es el contenedor de el canvas, `canvas` el elemento encargado de renderizar el juego, `width` y `height` los cuales determinan el tamaño en pixeles de el juego (estos ultimos dos parametros son opcionales).

Para crear nuestra instancia tendremos que seleccionar nuestros elementos de el HTML para pasarlos como parametro a nuestro construcor.

```JavaScript
const $game = document.querySelector("#game");
const $gameCanvas = document.querySelector("#game__display");
const GAME = new Game($game, $gameCanvas);
```

Despues de esto añadiremos nuestros niveles a el juego
con el metodo `addRoom` y lo seleccionaremos con el metodo `changeRoom`. Finalmente podremos arrancar nuestro juego con el metodo `startGame`

Una vez hecho todo esto nos quedaria de la siguiete manera:

```JavaScript
// -------------------- GAME SETTINGS --------------------- //
const $game = document.querySelector("#game");
const $gameCanvas = document.querySelector("#game__display");
const GAME = new Game($game, $gameCanvas);
GAME.debug = false;

// -------------------- ROOMS --------------------- //
GAME.addRoom(RoomTest1);
GAME.changeRoom("RoomTest1");
GAME.startGame();
```

### Ejemplo completo

```JavaScript
import {
  Room,
  Game,
  ObjectNode,
  Vector2,
  UIButton,
} from "https://cdn.jsdelivr.net/npm/recreo@0.2.0/dist/recreo.js";

class Player extends ObjectNode {
  constructor(GAME, x, y, w, h) {
    super(GAME, x, y, w, h);
    this.velocity = new Vector2(0, 0);
  }

  draw = (ctx) => {
    ctx.fillStyle = "#d57";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  };

  steps = (deltaTime) => {
    // velocidad horizontal
    this.velocity.x =
      (this._GAME.input.GetKeyPress("d") - this._GAME.input.GetKeyPress("a")) * 400 * deltaTime;
      // velocidad vertical
    this.velocity.y =
      (this._GAME.input.GetKeyPress("s") - this._GAME.input.GetKeyPress("w")) * 400 * deltaTime;

    // mover
    this.position = this.position.Sum(this.velocity);
  };
}

class PauseButton extends UIButton {
  constructor(GAME, x, y) {
    super(GAME, x, y, 100, 50, "PAUSE");
  }

  onClick = () => {
    if (this._GAME.gamePaused) {
      this._GAME.playGame();
      this.text = "PAUSE";
    } else {
      this._GAME.pauseGame();
      this.text = "PLAY";
    }
  };
}

class RoomTest1 extends Room {
  constructor(GAME) {
    super(GAME);

    const player = new Player(this._GAME, 0, 0, 50, 50);

    const button = new PauseButton(this._GAME, this._GAME.viewport.x - 110, 10);

    this.addInstance(player, false, "player");
    this.addInstance(button, true, "button");
  }
}

// -------------------- GAME SETTINGS --------------------- //
const $game = document.querySelector("#game");
const $gameCanvas = document.querySelector("#game__display");
const GAME = new Game($game, $gameCanvas);
GAME.debug = false;

// -------------------- ROOMS --------------------- //
GAME.addRoom(RoomTest1);
GAME.changeRoom("RoomTest1");
GAME.startGame();

```