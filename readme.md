# GoIT 23. REST API для работы с коллекцией карточек

## 1. Логика работы с пользователем. По адресу https://goit23-project.herokuapp.com/

### 1.1 Регистрация

Происходит на эндпоинте [`/users/signup`](#registration-request)

- При ошибке валидации возвращает [Ошибку валидации](#registration-validation-error).

- Если почта уже используется кем-то другим, то возвращает
  [Ошибку Conflict](#registration-conflict-error).

- При успешной регистрации получаем [Успешный ответ](#registration-success-response).

#### Registration request

```shell
POST /users/signup
Content-Type: application/json
RequestBody: {
  "email": "example@example.com", //Обязательное поле
  "password": "examplepassword", //Обязательное поле. Alphanum, min 3 chars
  "name": "Test", //Необязательное поле. По-умолчанию "NONAME"
  "subscription": "pro" //Необязательное поле. Может быть только "starter", "pro" или "business"
}
```

#### Registration validation error

```shell
{
    "status": "error",
    "code": 400,
    "message": "Field: password is required", //Не задали пароль при регистрации
    "data": "Bad Request"
}
```

#### Registration conflict error

```shell
{
    "status": "error",
    "code": 409,
    "message": "This email is already use", //Такой email уже используется
    "data": "Conflict"
}
```

#### Registration success response

```shell
{
    "status": "success",
    "code": 201,
    "message": "registration done",
    "data": {
        "id": "6092e64cc63fe94d603a2bfc",
        "email": "example@example.com",
        "subscription": "starter"
    }
}
```

### 1.2 Логин

Происходит на эндпоинте [`/users/login`](#login-request)

- При ошибке валидации возвращает [Ошибку валидации](#login-validation-error).

- Если пароль или email неверный, возвращает [Ошибку Unauthorized](#login-auth-error).

- При успешной авторизации получаем [Успешный ответ](#login-success-response).

#### Login request

```shell
POST /users/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

#### Login validation error

```shell
{
    "status": "error",
    "code": 400,
    "message": "Field: password length must be at least 3 characters long", //пароль меньше 3-х символов
    "data": "Bad Request"
}
```

#### Login auth error

```shell
{{
    "status": "error",
    "code": 401,
    "message": "Invalid credentials", //Неверный email или password
    "data": "Unauthorized"
}
```

#### Login success response

```shell
{
    "status": "success",
    "code": 200,
    "message": "login done",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTJlNjRjYzYzZmU5NGQ2MDNhMmJmYyIsImlhdCI6MTYyMDI0MDEyOCwiZXhwIjoxNjIwMjYxNzI4fQ.8Y2YQP6iJNRBIyJwhVs7kVCY0DAeoP0T4AGmF6WL2CA"
    }
}
```

### 1.3 Логаут

Происходит на эндпоинте [`/users/logout`](#logout-request)

- Если пользователь не залогинен, выдаем [Ошибку Forbidden](#logout-forbidden-error).

- При успешном выходе, удаляем токен и получаем [Успешный ответ](#logout-success-response).

#### Logout request

```shell
POST /users/logout
Authorization: "Bearer {{token}}"
```

#### Logout forbidden error

```shell
{
    "status": "error",
    "code": 403,
    "message": "Access denied",
    "data": "Forbidden"
}
```

#### Logout success response

```shell
Status: 204 No Content
```

### 1.4 Текущий пользователь - получить данные юзера по токену

Происходит на эндпоинте [`/users/current`](#current-user-request)

- Если пользователя не существует возращаем [Ошибку Unauthorized](#current-user-unauthorized-error)

- При успешном запросе получаем [Успешный ответ](#current-user-success-response).

#### Current user request

```shell
GET /users/current
Authorization: "Bearer {{token}}"

```

#### Current user unauthorized error

```shell
{
    "status": "error",
    "code": 403,
    "message": "Access denied",
    "data": "Forbidden"
}
```

#### Current user success response

```shell
{
    "status": "success",
    "code": 200,
    "message": "current user info",
    "data": {
        "email": "user1@mail.com",
        "subscription": "pro"
    }
}
```

### 1.5 Обновление подписки (`subscription`) пользователя

Происходит на эндпоинте [`/users`](#subscription-request)

- При ошибке валидации возвращает [Ошибку валидации](#subscription-validation-error).

- При успешном обновлении получаем [Успешный ответ](#subscription-success-response).

#### Subscription request

```shell
PATCH /users
Authorization: "Bearer {{token}}"
Content-Type: application/json
RequestBody: {
  "subscription" : "pro" //Обязательное поле. Может быть только "starter", "pro" или "business"
}
```

#### Subscription validation error

```shell
{
    "status": "error",
    "code": 400,
    "message": "Field: subscription must be one of [starter, pro, business]",
    "data": "Bad Request"
}
```

#### Subscription success response

```shell
{
    "status": "success",
    "code": 200,
    "message": "user subscription is update",
    "data": {
        "email": "user1@mail.com",
        "subscription": "pro"
    }
}
```
### 1.6 Обновление аватарки пользователя

Происходит на эндпоинте [`/users/avatars`](#avatar-update-request)

- При ошибке валидации возвращает [Ошибку валидации](#avatar-update-validation-error).

- При успешном обновлении получаем [Успешный ответ](#avatar-update-success-response).

#### Avatar update request

```shell
PATCH /users/avatars
Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: загруженный файл
}
```

#### Avatar update validation error

```shell
{
    "status": "error",
    "code": 400,
    "message": "File is not an image",
    "data": "Bad request"
}
```

#### Avatar update success response

```shell
{
    "status": "success",
    "code": 200,
    "message": "user avatar is update",
    "data": {
        "avatarUrl": "https://res.cloudinary.com/goit23-images/image/upload/v1621103245/node23/ojprqsucluvjpvh6msjy.png"
    }
}
```