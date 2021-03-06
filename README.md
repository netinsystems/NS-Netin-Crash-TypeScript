# **@netin-js/crash**

[![Build Status](https://devopmytra.visualstudio.com/NetinSystems/_apis/build/status/NS-Netin-Crash-TypeScript?repoName=NS-Netin-Crash-TypeScript&branchName=master)](https://devopmytra.visualstudio.com/NetinSystems/_build/latest?definitionId=318&repoName=NS-Netin-Crash-TypeScript&branchName=master)
[![@netin-js/crash package in Netin-Systems-Packages feed in Azure Artifacts](https://devopmytra.feeds.visualstudio.com/_apis/public/Packaging/Feeds/54947cc7-1c0a-4d71-a742-0f2cf64772d8/Packages/2f7e380e-6733-43a4-835a-63ac4923e4b1/Badge)](https://devopmytra.visualstudio.com/NetinSystems/_packaging?_a=package&feed=54947cc7-1c0a-4d71-a742-0f2cf64772d8&package=2f7e380e-6733-43a4-835a-63ac4923e4b1&preferRelease=true)
[![Node Version](https://img.shields.io/static/v1?style=flat&logo=node.js&logoColor=green&label=node&message=%3E=12%20||%2014&color=blue)](https://nodejs.org/en/)
[![Typescript Version](https://img.shields.io/static/v1?style=flat&logo=typescript&label=Typescript&message=4.3&color=blue)](https://www.typescriptlang.org/)
[![Known Vulnerabilities](https://img.shields.io/static/v1?style=flat&logo=snyk&label=Vulnerabilities&message=0&color=300A98F)](https://snyk.io/package/npm/snyk)
[![Sonarqube](https://badgen.net/badge/icon/sonarqube?icon=sonarqube&label)](https://sonarqube.mytracloud.es/dashboard?id=NS-Netin-Crash-TypeScript)
[![Documentation](https://img.shields.io/static/v1?style=flat&logo=readthedocs&logoColor=white&label=Documentation&message=API&color=blue)](https://docs.netin.io/apis/NS-Netin-Crash-TypeScript/index.html)

<div style="text-align:center;background-color:#0091B3;">
  <img src="https://netin.io/assets/img/landing/home.svg" alt="netin" width="500">
</div>

___

## **Table of contents**

- [**@netin-js/crash**](#netin-jscrash)
  - [**Table of contents**](#table-of-contents)
  - [**Introduction**](#introduction)
  - [**Installation**](#installation)
  - [**Information**](#information)
  - [**Use**](#use)
    - [**Mensajes de error**](#mensajes-de-error)
    - [**Traceability identifier**](#traceability-identifier)
    - [**Crash**](#crash)
    - [**Multi**](#multi)
    - [**Boom**](#boom)
  - [**API**](#api)
  - [**Collaboration**](#collaboration)
  - [**License**](#license)

## **Introduction**

The goal of **@netin-js/crash** is to provide improved, but simplified, error handling, while standardizing error handling across all Netin modules.

## **Installation**

You need to register with Azure DevOps to install it, the package can be found in the [Netin Systems feed](https://devopmytra.visualstudio.com/NetinSystems/_packaging?_a=connect&feed=Netin-Systems-Packages).

- **npm**

```shell
npm install @netin-js/crash
```

- **yarn**

```shell
yarn add @netin-js/crash
```

## **Information**

This library provides us with 3 different types of errors to use depending on the context in which we find ourselves:

- **Crash**: it is the main type of error, it does not allow adding metadata to the error, which will be specially treated by the logging libraries, as well as relating errors to their causes.
- **Multi**: it is the type of error mainly used in validation processes in which we can have more than one error that prevents an information input or a group of parameters from being validated. This type of error is the one returned to us by the @ netin-js / doorkeeper validation libraries.
- **Boom**: this type of error standardizes errors in RESTful environments by providing _helpers_ that allow the easy creation of standardized responses to frontend applications.

## **Use**

### **Mensajes de error**

One of the main and common parameters of the three types of error is the message associated with the error. This message indicates the type of error that occurred, always taking into account the [good practices](https://docs.microsoft.com/es-es/windows/win32/uxguide/mess-error?redirectedfrom=MSDN):

- Be clear and unambiguous.
- Be concise and provide accurate information and only what is necessary.
- Don't use technical jargon.
- Be humble, don't blame the user.
- Avoid using negative words.
- Indicates the way to fix it to the user.
- Do not use capital letters.
- Indicates the correct actions, if any.
- If there are details about the error, provide them in the corresponding section.

### **Traceability identifier**

According to the standard [RFC 4122](https://es.wikipedia.org/wiki/Identificador_%C3%BAnico_universal), it allows us to associate an identifier of operation or request to the error. This is especially useful for tracing errors in requests or transactions that occur between different systems or libraries. The identifier should be created by the process or system that initiates the operation (Frontend, Service ...), being included in all processes and registers (logging with @ netin-logger) so that this can be used in troubleshooting processes. identifier as _filter_, allowing easy extraction.

![Logging example](../.assets/logging-capture.png)

### **Crash**

Simple example of using the `Crash` error type.

```ts
import { Crash } from '@netin-js/Crash'
import { v4 } from 'uuid';

const enhancedError = new Crash('Example', v4());
console.log(enhancedError.message); // 'Example'
```

or even simpler

```ts
import { Crash } from '@netin-js/Crash'

const enhancedError = new Crash('Example');
console.log(enhancedError.message); // 'Example'
```

Crash allows us to add extra information about the error that can be used by higher layers of our application or at the time of recording the errors.

```ts
import { Crash } from './Crash';
import fs from 'fs';
import { v4 } from 'uuid';

const operationId = v4();
try {
  const myContent = fs.readFileSync('path/to/file');
} catch (error) {
  const enhancedError = new Crash(`Error reading the configuration file`, operationId, {
    cause: error as Error,
    name: 'FileError',
    info: {
      path: 'path/to/file',
    },
  });
  console.log(enhancedError.trace());
  // [ 'FileError: Error reading the configuration file',
  // 'caused by Error: ENOENT: no such file or directory, open \'path/to/file\'' ]
}
```

Crash allows us to easily determine if an error has a specific cause, being able to act differently for each cause.

```ts
ourPromiseThatRejectCrash()
  .then(()=>{
    // Our code in case of success
  })
  .catch(error => {
    if (error.hasCauseWithName('FileError')) {
      // Our code in case of file error
    } else {
      // Our code for the rest type of errors
    }
  })
```

### **Multi**

Simple example of using `Multi` type error.

```ts
import { Multi } from '@netin-js/Crash'
import { v4 } from 'uuid';

const enhancedError = new Multi('Example', v4(), {
  causes: [new Error('My first check that fail'), new Error('My Second check that fail')]
});
```

Errors can be added later, which can be especially useful in transformation processes where various errors can appear during execution.

```ts
import { Multi, Crash } from '@netin-js/Crash'
import { v4 } from 'uuid';

const arrayOfNumbers: number[] = [];
const operationId = v4();
let enhancedError: Multi | undefined;
for (let idx = 0; idx < 10; idx++) {
  arrayOfNumbers.push(Math.random() * (10 - 0) + 0);
}
for (const entry of arrayOfNumbers) {
  if (entry > 5) {
    const newError = new Crash(`Number of of range`, operationId, {
      name: 'ValidationError',
      info: {
        number: entry,
      },
    });
    if (enhancedError) {
      enhancedError.push(newError);
    } else {
      enhancedError = new Multi(`Errors during validation process`, operationId, {
        causes: [newError],
      });
    }
  }
}
if (enhancedError) {
  console.log(enhancedError.trace());
}
```

### **Boom**

The most typical way to use the `Boom` type of error is through helpers, thanks to them, we can create information-rich errors, within the context of our REST API, in a simple way.

```ts
import express from 'express';
import { BoomHelpers } from '@netin-js/crash';
import { v4 } from 'uuid';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const enhancedError = BoomHelpers.internalServerError('Error during request processing', v4());
  res.status(enhancedError.status).json(enhancedError);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
```

Any request to the previous endpoint will return the following result:

```json
{
  "uuid": "2a931651-6921-4bda-864e-123b69829cff",
  "status": 500,
  "code": "HTTP",
  "title": "Internal Server Error",
  "detail": "Error during request processing"
}
```

We can even provide more information to the user through the options.

```ts
import express from 'express';
import { BoomHelpers, Crash } from '@netin-js/crash';
import { v4 } from 'uuid';
const app = express();
const port = 3000;

const mock = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  req.body = {};
  req.body.reqId = v4();
  req.body.order = 'myOrder';
  next();
};

function getOrder(order: string, uuid: string): Promise<void> {
  return Promise.reject(
    new Crash(`The requested record is not present in the system`, uuid, {
      name: 'DataNotPresent',
      info: { order },
    })
  );
}

app.use(mock);
app.get('/order', (req, res) => {
  getOrder(req.body.order, req.body.reqId)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      const enhancedError = BoomHelpers.badRequest(
        'Error getting the requested order',
        req.body.reqId,
        {
          cause: error,
          source: {
            pointer: req.path,
            parameters: { order: req.body.order },
          },
          name: error.name,
          info: {
            detail: error.message,
          },
          links: {
            help: 'help/link/about/orders',
          },
        }
      );
      res.status(enhancedError.status).json(enhancedError);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

Any request to the previous endpoint will return the following result:

```json
{
  "uuid": "59fe72ec-44dc-4cc3-84ec-46c98df00283",
  "links": {
    "help": "help/link/about/orders"
  },
  "status": 400,
  "code": "DataNotPresent",
  "title": "Bad Request",
  "detail": "Error getting the requested order",
  "source": {
    "pointer": "/order",
    "parameters": {
      "order": "myOrder"
    }
  },
  "meta": {
    "detail": "The requested record is not present in the system"
  }
}
```

## **API**

- [[Crash]]
- [[Multi]]
- [[Boom]]

## **Collaboration**

As in the rest of the **Netin Systems** repositories, any collaboration is always welcome.

If you think there is a bug, create a [bug] (https://docs.microsoft.com/en-us/azure/devops/boards/backlogs/manage-bugs) providing as much information as possible.

If you want to make a new contribution, create a new branch, taking into account the flow established by [GitFlow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow) , make your modifications to it and request their approval through [Pull Request](https://docs.microsoft.com/en-us/azure/devops/repos/git/pull-requests?view=azure-devops ), correctly filling in the template.

## **License**

Copyright 2021 Network Intelligence S.L. All rights reserved.

Note: All information contained herein is, and remains the property of Network Intelligence S.L. and its suppliers, if any. The intellectual and technical concepts contained herein are property of Network Intelligence S.L. and its suppliers and may be covered by European and Foreign patents, patents in process, and are protected by trade secret or copyright.
Dissemination of this information or the reproduction of this material is strictly forbidden unless prior written permission is obtained from Network Intelligence.