const userDB = require('../../db/schemas/user');

exports.deleteuser = async (req, res, next) => {
    try {
        const user = await userDB.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(404);
            throw 'User not found';
        }

        res.status(200).json({
            error: false,
            message: 'Success'
        });
    } catch (err) {
        next(new Error(ex.message));
    }
}

exports.getuserinfo = async (req, res, next) => {
    try{
        const user = await userDB.findById(req.params.id);
        if(!user){
            res.status(404);
            throw 'User not found';
        }
        
        user = user.toObject();
        delete user.password;
        delete user.reset_hash;
        delete user.token;
        delete user.change_email_hash;
        
        res.status(200).json({ 
            error: false,
            message: user,
        });
    }catch(ex){
        next(new Error(ex.message));
    }
};




