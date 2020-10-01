# **@netin-js/crash**
[![@netin-js/crash package in Netin-Systems-Packages@Local feed in Azure Artifacts](https://devopmytra.feeds.visualstudio.com/_apis/public/Packaging/Feeds/11f97a52-7344-41b1-b9cf-76d1ab3ad622%40148bf7a9-08b9-413e-9768-e937aff0ea98/Packages/614812aa-7eb8-4530-9c9a-74eb594fcb7a/Badge)](https://devopmytra.visualstudio.com/NetinSystems/_packaging?_a=package&feed=Netin-Systems-Packages&package=%40netin-js%2Fcrash&protocolType=Npm&version=0.1.0-transportPrimitives.359&view=overview)
 
**@netin-js/crash** 
<div style="text-align:center;background-color:#0091B3;">
          <img src="https://netin.io/assets/img/landing/home.svg" alt="netin" width="500">
</div>
 
# Tabla de contenidos
 
- [Introducción](#Introducción)
- [Instalación](#Instalación)
- [Información](#Información)
- [Uso](#Uso)
- [API](#API)
- [Colaboración](#Colaboración)
- [Licencia](#Licencia)
 
## **Introducción**

Con netin-js/crash podemos mantener un formato estandar para los errores que tengamos durante el desarrollo de un programa para Netin Systems.

Esta librería nos proporciona 3 tipos de errores diferentes para utilizar dependiendo del contexto en el que nos encontremos:
- **Crash**: se utiliza para los errores comunes, es el error básico.
- **Multi**: se utiliza cuando tenemos una sucesión de errores y queremos agruparlos todos en el mismo.
- **Boom**: se utiliza para los errores HTTP.

## **Instalación**

Es necesario registrarse con Azure DevOps para poder instalarlo, el paquete se encuentra en el [feed de Netin Systems](https://devopmytra.visualstudio.com/NetinSystems/_packaging?_a=connect&feed=Netin-Systems-Packages).
 
```shell
npm install @netin-js/crash
```
 
## **Información**

netin-js/crash nos ofrece 3 clases diferentes para utilizar dependiendo del contexto en el que se estén reportando el error. Como ya hemos visto en la introducción, las clases tienen las siguientes utilidad:
- **Crash**: se utiliza para los errores comunes, es el error básico.
- **Multi**: se utiliza cuando tenemos una sucesión de errores y queremos agruparlos todos en el mismo.
- **Boom**: se utiliza para los errores HTTP.

Las 3 clases extienen de la misma clase (Base), para darnos cierta uniformidad a la hora de reportar un error del tipo que sea.  
Todos los errores generados con cualquiera de estas 3 clases dispondrán de los siguiente atributos communes: 
- *name* \- nombre de error.
- *message* \- mensaje de error.
- *_info* \- información extra sobre el error.
- *_uuid* \- identificador del proceso donde se produce el error.


## **Uso**

Para la correcta implementación de la librería en un proyecto debemos importar las clases que vayamos a utilizar de la siguiente manera:
```js
import { Crash, Multi, Boom } from '@netin-js/Crash'
```

Cuando estemos utilizando esta librería, los identificadores UUID deben estar formateado segun el estandar [RFC 4122](https://es.wikipedia.org/wiki/Identificador_%C3%BAnico_universal)

### **Crash**

Para crear una instancia de un objeto de tipo Crash, deberemos pasarle el mensaje de error y el UUID del proceso.
```js
import { Crash } from '@netin-js/Crash'
import { v4 as uuidV4 } from 'uuid';

const uuidTest = uuidV4();
const errorTest = new Crash('Example', uuidTest);
```
De esta manera crearíamos un error con el mensaje: 'Example'  
Una vez creado el error podríamos acceder a sus atributos de la siguiente manera:

```js
  console.log(errorTest.name); // CrashError
  console.log(errorTest.message); // Example
  console.log(errorTest.uuid); // 550e8400-e29b-41d4-a716-446655440000
  if (errorTest._isCrash) // Es un error de tipo Crash
  {
    console.log('Es un error de tipo Crash');
  }else{
    console.log('No es un error de tipo Crash');
  }
```

Además, podremos pasarle información extra sobre el error. como la causa del error que puede ser de tipo Crash o Error, nombre y un objeto con información adicional.
Se podría añadir la causa del error, que sería un objeto de tipo ``Crash`` o ``Error`` al que podríamos acceder para obtener información más en profundidad sobre el problema que ha ocurrido.  
También se podría especificar el nombre del error para cambiar el que viene por defecto ('CrashError').
Por último está la opción de añadir una estructura de strings con información adicional. 


```js
import { Crash } from '@netin-js/Crash'
import { v4 as uuidV4 } from 'uuid';

const uuidTest = uuidV4();
const causeErr = new Error('Cause');
const objectTest = {
    par: 'info1',
    par2: 'info2',
};
const errorTest = new Crash('Example', uuidTest, {
    name: 'ERROR_TYPE',
    cause: causeErr,
    info: objectTest,
});
```
Estos nuevos atributos que hemos metido en el objeto de error pueden leerse de la siguiente manera:
```js
console.log(errorTest.name); // ERROR_TYPE
console.log(errorTest.cause?.name); // Error
console.log(errorTest.cause?.message); // Cause
console.log(errorTest.info.par?); // info1
```

Por último veremos la utilización de los métodos de la clase (estos métodos están explicados en la parte de API):
```js
const causeError = errorTest.findCauseByName('Error'); // Obtenemos el objeto Error que se ha inroducido como causa del objeto Crash
const crashFullStack = errorTest.fullStack(); // En el caso de haber introducido información en el atributo stack, sacará un string concatenando las causas de los errores empezando por la propia del Crash y continuando con la del 'cause' (concatenando un 'caused by: ' delante)
const isCauseOfError = errorTest.hasCauseWithName('Error'); // Nos dice si un error con el nombre proporcionado es una causea del error. En este caso sería TRUE
const crashJson = errorTest.toJSON(); // Devolvería un string con una estructura en formato Json con los valores del objeto
/*
{
  "name": "ERROR_TYPE",
  "message": "Example",
  "uuid": "550e8400-e29b-41d4-a716-446655440000", 
  "info": {
    "par": "info1", 
    "par2": "info2"
  },
  "cause": {
    "name": "Error",
    "message": "Cause"
  }
}
*/
const crashToString = errorTest.toString(); // Nos sacaría un string del nombre y el mensaje de error concatenados con ':': 'ERROR_TYPE: Example'
const crashTrace = errorTest.trace(); // Sacaría un array con el nombre y mensaje de error del Crash y la secuencia de errores que lo han causado, manteniendo el mismo formato (añadiendo 'caused by: ' antes) -> ['ERROR_TYPE: Example', 'caused by: Error: Cause']
```



### **Multi**

Para crear una instancia de un objeto de tipo Multi, deberemos pasarle el mensaje de error y el UUID del proceso.
```js
import { Multi } from '@netin-js/Crash'
import { v4 as uuidV4 } from 'uuid';

const uuidTest = uuidV4();
const errorTest = new Multi('Example', uuidTest);
```
Además, podremos pasarle información extra como las causas del error que puede ser de tipo array de Crash y Error, un Error o un Crash, nombre y un objeto con información adicional.
```js
import { Multi } from '@netin-js/Crash'
import { v4 as uuidV4 } from 'uuid';

const uuidTest = uuidV4();
const causesErr: Array<Crash | Error> = [];
causes.push(new Crash('Crash Error 1', uuidTest, { name: 'ConnectionError' }));
causes.push(new Crash('Crash Error 2', uuidTest, { name: 'ValidationError' }));
const objectTest = {
    par: 'info1',
    par2: 'info2',
};

const errorTest = new Multi('Example', uuidTest, {
    name: 'ERROR_TYPE',
    causes: causesErr,
    info: objectTest,
});
```

### **Boom**

Para la instanciación de un objeto de tipo Boom, deberemos pasarle el mensaje de error, el UUID del proceso y el código de error HTTP (si no se especifíca, utilizará el 500 por defecto).
```js
import { Boom } from '@netin-js/Crash'
import { v4 as uuidV4 } from 'uuid';

const uuidTest = uuidV4();
const errorTest = new Boom('Example', uuidTest);
```
Además, podremos pasarle un BoomOptions con algo de información extra, que es una extensión del BaseOptions.
```js
import { Boom } from '@netin-js/Crash'
import { v4 as uuidV4 } from 'uuid';

const errorTest = new Error('Example of common error');

const uuidTest = uuidV4();
const optionsTest: BoomOptions = {
  links: {
    self: '/link/test',
  },
  source: {
    pointer: '/this/point',
    parameter: 'test2',
  },
  cause: errorTest,
  info: {
    a: 2,
  },
};

const error = BoomHelpers.expectationFailed('Example', uuidTest, 404, optionsTest);
```
No solo podemos generarlos así, también tenemos la posibilidad de utilizar las funciones definidas en httpHelpers para generar los errores HTTP sin tener que especificar el codigo de error ya que va implícito en la función.
```js
import * as BoomHelpers from './httpHelpers';
import { v4 as uuidV4 } from 'uuid';

const errorTest = new Error('Example of common error');

const uuidTest = uuidV4();
const optionsTest: BoomOptions = {
  links: {
    self: '/link/test',
  },
  source: {
    pointer: '/this/point',
    parameter: 'test2',
  },
  cause: errorTest,
  info: {
    a: 2,
  },
};

/* Generamos un Boom con código 400*/
const error = BoomHelpers.badRequest('Example', uuidTest, optionsTest);
/* Generamos un Boom con código 401*/
const error = BoomHelpers.unauthorized('Example', uuidTest, optionsTest);
```

## **API**

### **CrashOptions** _interface_
  CrashOptions es una interfaz con las siguientes propiedades:  
  ```js
  {
    cause?: Crash | Error;
    name?: string;
    info?: {
      [x: string]: any;
    };
  }
  ``` 
### **CrashObject** _interface_
  CrashObject es una interfaz con las siguientes propiedades:
  ```js
  {
    name: string;
    message: string;
    uuid: string;
    trace: string[];
  }
  ```
### **Crash** _class_
- **constructor**  
  - **Crash(message: string, uuid: string, options?: CrashOptions)**   
    Contructor de la clase Crash. 
- **properties**
  - **cause: Crash | Error | undefined**  
    Devuelve la causa del error
  - **info: {[x: string]: any} | undefined**
    Devuelve la propiedad info de las options
  - **isCrash: boolean**  
    Indica si el error es de tipo Crash o no
  - **message: string**  
    Devuelve en mensaje de error
  - **name: string**  
    Devuelve el nombre del error
  - **uuid: string**  
    Devuelve el identificador con el que se ha generado el error
- **methods**
  - **findCauseByName(name: string): Crash | Error | undefined**  
    Si la causa tiene el nombre especificado en el método devuelve la causa (tipo Crash o Error) coincidente.
  - **fullStack(): string | undefined**  
    Devuelve un string con la pila entera de errores.
  - **hasCauseWithName(name: string): boolean**  
    Indica si la causa especificada se encuentra dentro de la cadena de errores
  - **toJSON(): CrashObject**  
    Devuelve un objeto del tipo CrashObject con la información del error
  - **toString(): string**  
    Devuelve un string que concatena el nombre del error con el mensaje del error.
  - **trace(): string[]**  
    Devuelve un array con toda la secuencia de errores

### **MultiOptions** _interface_
  MultiOptions es una interfaz con las siguientes propiedades:  
  ```js
  {
    causes?: Array<Crash | Error> | Crash | Error;
    name?: string;
    info?: {
      [x: string]: any;
    };
  }
  ``` 
### **MultiObject** _interface_
  MultiObject es una interfaz con las siguientes propiedades:
  ```js
  {
    name: string;
    message: string;
    uuid: string;
    trace: string[];
  }
  ```
### **Multi** _class_
- **constructor**  
  - **Multi(message: string, uuid: string, options?: MultiOptions)**   
    Contructor de la clase Multi. 
- **properties**
  - **causes: Array<Crash | Error>**  
    Devuelve un array con las diferentes causas del error
  - **info: {[x: string]: any} | undefined**
    Devuelve la propiedad info de las options
  - **isMulti: boolean**  
    Indica si el error es de tipo Multi o no
  - **message: string**  
    Devuelve en mensaje de error
  - **name: string**  
    Devuelve el nombre del error
  - **uuid: string**  
    Devuelve el identificador con el que se ha generado el error
- **methods**
  - **Multify(error: ValidationError): number**
    Inserta los diferentes errores de validación de un objeto con la libreria @hapi/joi. Devuelve el numero de errores añadidos.
  - **findCauseByName(name: string): Crash | Error | undefined**  
    Busca si existe una causa con el nombre pasado al método y devuelve la causa (tipo Crash o Error) coincidente.
  - **fullStack(): string | undefined**  
    Devuelve un string con la pila entera de errores.
  - **hasCauseWithName(name: string): boolean**  
    Indica si la causa especificada se encuentra dentro de la cadena de errores
  - **pop(): Crash | Error | undefined**  
    Elimina si existe el último error del array causes y devuelve dicho error.
  - **push(error: Crash | Error): void**  
    Añade un error al array causes.
  - **toJSON(): MultiObject**  
    Devuelve un objeto del tipo MultiObject con la información del error
  - **toString(): string**  
    Devuelve un string que concatena el nombre del error con el mensaje del error.
  - **trace(): string[]**  
    Devuelve un array con toda la secuencia de errores

### **APISource** _interface_
  APISource es una interfaz con las siguientes propiedades:
  ```js
  {
    pointer: string;
    parameter: { 
      [x: string]: any;
    };
  }
  ```
### **APIError** _interface_
  APIError es una interfaz con las siguientes propiedades:
  ```js
  {
    uuid: string;
    links?: { 
      [x: string]: any;
    };
    status: number;
    code: string;
    tittle: string;
    detail?: string;
    source?: APISource;
    meta?: {
      [x: string]: any;
    };
  }
  ```
### **BoomOptions** _interface_
  BoomOptions es una interfaz con las siguientes propiedades:
  ```js
  {
    links?: {
      [x: string]: string;
    };
    source?: APISource;
    cause?: Error | Multi | Crash;
    name?: string;
    info?: { 
      [x: string]: any;
    };
  }
  ```
### **Boom** _class_
- **constructor**  
  - **Boom(message: string, uuid: string, code = 500, options?: BoomOptions)**   
    Contructor de la clase Boom. 
- **properties**
  - **cause: Error | Multi | Crash**  
    Devuelve la causa del error
  - **info: {[x: string]: any} | undefined**
    Devuelve la propiedad info de las options
  - **isBoom: boolean**  
    Indica si el error es de tipo Boom o no
  - **links: {[x: string]: any} | undefined**  
    Enlaces que proporcionan más detalles sobre la causa del error
  - **message: string**  
    Devuelve en mensaje de error
  - **name: string**  
    Devuelve el nombre del error
  - **source: APISource | undefined**  
    Devuelve el source del error
  - **status: number**  
    Devuelve el code del error
  - **uuid: string**  
    Devuelve el identificador con el que se ha generado el error
- **methods**
  - **Boomify(error: ValidationError): number**
    Inserta los diferentes errores de validación de un objeto con la libreria @hapi/joi. Devuelve el numero de errores añadidos.
  - **toJSON(): APIError**  
    Devuelve un objeto del tipo APIError con la información del error
  - **toString(): string**  
    Devuelve un string que concatena el nombre del error con el mensaje del error.

### **BoomHelpers** _const_
  Esta constante actúa como un objeto que tiene diferentes propiedades con valor tipo function. Dichas propiedades de tipo function generan un error de tipo Boom con el code correcto para cada tipo de error.
  Listado completo de las propiedades de BoomHelpers:
- **badRequest:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 400
- **unauthorized:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 401
- **paymentRequired:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 402
- **forbidden:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 403
- **notFound:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 404
- **methodNotAllowed:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 405
- **notAcceptable:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 406
- **proxyAuthRequired:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 407
- **requestTimeout:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 408
- **conflict:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 409
- **gone:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 410
- **lengthRequired:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 411
- **preconditionFailed:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 412
- **payloadTooLarge:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 413
- **uriTooLong:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 414
- **unsupportedMediaType:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 415
- **rangeNotSatisfiable:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 416
- **expectationFailed:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 417
- **teapot:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 418
- **unprocessableEntity:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 422
- **locked:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 423
- **failedDependency:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 424
- **tooEarly:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 425
- **upgradeRequired:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 426
- **preconditionRequired:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 428
- **tooManyRequests:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 429
- **headerFieldsTooLarge:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 431
- **illegal:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 451
- **internalServerError:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 500
- **notImplemented:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 501
- **badGateway:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 502
- **serverUnavailable:(message: string, uuid: string, options?: BoomOptions) => Boom**  
  Genera un error de tipo Boom con el código 503
- **gatewayTimeout:(message: string, uuid: string, options?: BoomOptions) => Boom**   
  Genera un error de tipo Boom con el código 504

## **Colaboración**
 
Este paquete pertenece al monorepositorio de la librería @netin-js, por lo que para cualquier colaboración se han de contemplar las normas de este.
Para mas detalles visite [@netin-js](https://devopmytra.visualstudio.com/NetinSystems/_git/NS-Netin-Library-TypeScript?path=%2FREADME.md&_a=preview).
 
## **Licencia**
 
**Copyright 2020 Netin Systems S.L. All rights reserved.**
> **Note**: 
> All information contained herein is, and remains the property of **Netin Systems S.L.** and its suppliers, if any. The intellectual and technical concepts contained herein are property of **Netin Systems S.L.** and its suppliers and may be covered by European and Foreign patents, patents in process, and are protected by trade secret or copyright.  Dissemination of this information or the reproduction of this material is strictly forbidden unless prior written permission is obtained from **Netin Systems S.L.**