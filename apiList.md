POST /signup
POST /login
POST /logout

profileRouter
GET /profile/view
PATCh /profile/edit
PATCH /profile/password


connectionRequestRouter
POST /request/send/:status/:userId
<!-- POST /request/send/Rejected/:userId -->(optional)
POST /request/review/:status/:requestId
<!-- POST /request/review/rejected/:requestId -->(optional)

userRouter
GET /user/connections
GET /requests/recieved
GET /feed-gets you the profiles of other users on platform

Status: ignored,intrested,rejected,accepted