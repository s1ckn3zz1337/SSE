# Routes

## Requirements

OWASP TOP 10 - [A4 - Insecure Direct Object References][1]

[1]: https://www.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References

## User Routes
* Default Route - Login/Index
```
GET - /
```
* Show Keyring
```
GET - /user/:id/keyring
```
* Create new User
```
POST - /register
```
* Create new KeyRing
```
POST - /user/:id/keyring
```
* Create new Password
```
POST - /user/:id/keyring/:id
```
Wenn wir den PrivKey nicht speichern:
* Decrypt Password
```
POST - /user/:id/keyring/:keyRingId/key
```