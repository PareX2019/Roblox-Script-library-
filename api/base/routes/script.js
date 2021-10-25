const users = require('../../db/schemas/user');
const scripts = require('../../db/schemas/script');

exports.upload = (req, res) => {
    try {
        const user = await users.findOne({
            username: req.body.username
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if(!user.verifiedEmail){
            res.status(404);
            throw 'Please verify your email before trying to upload';
        }
  
       const { name, description, tags, thubnail, owner } = req.body;

      if(name.length > 30){
          res.status(400);
          throw 'Script name must be less than 30 characters.';
      }

      if(description.length > 100){
          res.status(400);
          throw 'Script description must be less than 100 characters.';
      }

      if(tags.length > 15){
          res.status(400);
          throw 'Your only allowed to have 15 tags with in each script.';
      }

       let tagsErr = false;
       tags.forEach(tag => {
           if(tag.length > 15){
            tagsErr = true;
           }
       });

       if(tagsErr){
           res.status(400);
           throw 'Tags length must be less than 15 characters.';
       }

       

       



        res.status(201).json({
            error: false,
            message: 'Uploaded'
        });

    } catch (ex) {
        next(new Error(ex.message));
    }
};