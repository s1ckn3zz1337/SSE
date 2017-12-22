# Database Scheme

DB Schema = Frontend <-> Backend JSON Scheme

## Scheme

### User:
```
{
    _id: <ObjectId>,
    username: String,
    email: String,
    password: String,
    keyrings: [keyring]
}
```

### KeyRing:
```
{
   _id: <ObjectID>,
   (privateKey: String,)
   keyEntities: [keyEntity]
}
```
### KeyEntity:
```
{
    _id: <ObjectId>,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
}
```