# 🪓 Ax-grinding series  | ⚛️ NodeJS + TypeORM + Postgres +  Upload and import csv files
[![GitHub package.json version](https://img.shields.io/github/package-json/v/adaolima/reactjs-fundamentals-challenge-gostack)](https://github.com/adaolima/reactjs-fundamentals-challenge-gostack)
[![Custom badge](https://img.shields.io/endpoint?label=LinkedIn%20Profile&url=https%3A%2F%2Flinkedin-profile.free.beeceptor.com%2Fmy%2Fapi%2Fpath )](https://www.linkedin.com/in/adaolima)

## 🚀 GoStack exercise by Adão Lima

__Course by Rocketseat__

Install database trough nodeJS

```shell
docker run --name gostack_desafio06 -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```


Install dependencies

```shell
Yarn
```

Run migrations

```shell
Yarn typeorm migration:run
```

Run app

```shell
Yarn dev:server
```

Test app

```shell
Yarn test
```

### ⚡️💡 Insights

- Bulk import is the correct to avoid stress database processment, in import datas form files text;
- [Decorators from TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md), help set types relations to database models;
- Use models decorateds, in repositories, as way typed to handle datas;
- When imported repository, you can acess methods to handle database;
- After use the method create(), from a repository, to create a new entity, you will need to use save() method, to register or update datas on database;



