# Routes

## Requirements

OWASP TOP 10 - [A4 - Insecure Direct Object References][1]

[1]: https://www.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References

## User Routes
* Default Route - Login Interface
```
GET - /
```
* Login User
```
POST - /login [username, password]
```
* Register Interface
```
GET - /register
```
* Create new User
```
POST - /register [username, email, password]
```
* Show Keyring
```
GET - /keyring/:id
```
* Create new KeyRing
```
POST - /keyring [name, description]
```
* Create new Password
```
POST - /password [idkeyring, name, description, user, password]
```
Wenn wir den PrivKey nicht speichern:
* Decrypt Password
```
POST - /descypt/:id
```