# 🪓 Ax-grinding series  | ⚛️ NodeJS + TypeORM + Postgres +  Upload and import csv files

## 🚀 GoStack exercise by Adão Lima

__Course by Rocketseat__

Install dependecies

```shell
Yarn
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



