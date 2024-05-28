const express = require('express')
const {createUser, loginController, getAllUser, getAnUser, getAnUserWithId, deleteAnUserWithId, updateUser, handleRefreshToken, logOutCrtl} = require('../controller/userCtrl')
const {authMiddleWare, isAdmin} = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', createUser)

router.post('/login', loginController)




router.get('/users', getAllUser)

router.get('/findUser', getAnUser)

router.get("/refresh", handleRefreshToken)

router.get("/logout", logOutCrtl)



router.get('/:id',authMiddleWare, isAdmin, getAnUserWithId)

router.delete("/:id",authMiddleWare, deleteAnUserWithId)

router.put("/edit",authMiddleWare, updateUser)

router.put("/block-user/:id",authMiddleWare, isAdmin, updateUser)

router.put("/unblock-user/:id",authMiddleWare, updateUser)


module.exports = router