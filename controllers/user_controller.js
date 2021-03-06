const User = require("../models/user");
const fs = require('fs');
const  path = require('path')
module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
    //right now its not going to show all the users in the profile page  cause it is not linked to
    //profile page it will show the current signed in user
  });
};
// render the sign up page

module.exports.update = async function (req, res) {
  //user which are signed in can update only no one can fiddle with the inspect button
  //   if (req.user.id == req.params.id) {
  //     User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
  //       return res.redirect("back");
  //     });
  //   } else {
  //     return res.status(401).send("Unauthorized");
  //   }
  // };
  if (req.user.id == req.params.id) {
    try {
      //find the user
      let user = await User.findById(req.params.id);
      //we are not able to get the data from the form of user_profile.ejs  cause it is multi parser and
      //it needed to
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log(" **** multer error", err);
        }
        // console.log(req.file)
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
//if user already have the avatar then del it
if(user.avatar){
  fs.unlinkSync(path.join(__dirname, '..',user.avatar))
}









          //saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
};
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "Codial | Sign Up",
  });
};
// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Codial | Sign In",
  });
};
// get the sign up data
module.exports.create = function (req, res) {
  //console.log(req.body)
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }
    console.log(user);
    if (!user) {
      console.log("user not present");
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signing up");
          return;
        }

        return res.redirect("/users/sign-in");
      });
    } else {
      console.log("user present");

      return res.redirect("back");
    }
  });
};
// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "logged in successfully");
  // TODO later

  return res.redirect("/");
};
module.exports.destroySession = function (req, res) {
  //passport js gives this request(built in)
  req.logout();
  req.flash("success", "logged out successfully");
  return res.redirect("/");
}; //create your own middleware to transfer this req message to response one
