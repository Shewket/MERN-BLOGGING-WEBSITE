import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

import User from '../Schema/User.js';


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password



const formatDatatoSend = (user) => {

    const access_token = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}


const generateUsername = async (email) => {
    let username = email.split('@')[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username" : username}).then((result) => result)

    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";

    return username;

}

const signupUser = (req, res) => {
    let {fullname, email, password} = req.body;

    // Validating the data from frontend
    if(fullname.length < 3) {
        return res.status(403).json({"error": "Fullname must be at least 3 letters long"});
    }
    if(!email.length){
        return res.status(403).json({"error": "Email is required"});
    }

    if(!emailRegex.test(email)) {
        return res.status(403).json({"error": "Email is invalid"});
    }

    if(!passwordRegex.test(password)) {
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"})
    }

    bcrypt.hash(password, 10, async (err, hash_password) => {

        let username = await generateUsername(email);

        let user = new User({
            personal_info: {fullname, email, password: hash_password, username}
        })

        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err => {

            if(err.code == 11000) {
                return res.status(500).json({"error" : "Email already exists"})
            }

            return res.status(500).json({"error": err.message})
        })
    })
}

const signInUser = (req, res) => {

    let {email, password} = req.body;

    User.findOne({"personal_info.email": email})
    .then((user) => {
        if(!user) {
            return res.status(403).json({"error": "Email not found"});
        }
        

        if(!user.microsoft_auth){

            bcrypt.compare(password, user.personal_info.password, (err, result) => {

                if (err) {
                    return res.status(403).json({"error": "Email occured while login. Please try again"});
                }
    
                if(!result){
                    return res.status(403).json({"error": "Incorrect password"})
                } else{
                    return res.status(200).json(formatDatatoSend(user));
                }
    
            })

        } else {
            return res.status(403).json({"error": "Account was created using microsoft. Try logging in with microsoft."})
        }
    
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({"error": err.message});
    })

}

const microsoftAuth = async (req, res) => {

    let {email, access_token, fullname} = req.body;

    let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img microsoft_auth").then( (u) => {
        return u || null;
    })
    .catch(err => {
        return res.status(500).json({"error": err.message});
    }) 


    if(user){

        if(user.microsoft_auth){
            return res.status(403).json({"error": "This email was signed up without microsoft. Please log in with password to access the account"});
        }

    }
    else{

        let username = fullname.split(" ")[0];
        
        user = new User({
            personal_info: {fullname, email, username},
            microsoft_auth: true
        })

        await user.save().then( (u) => {
            user = u;
        })
        .catch(err => {
            return res.status(500).json({"error": err.message});
        })

    }

    return res.status(200).json(formatDatatoSend(user))

}

const searchUser = (req, res) => {

    let {query} = req.body;

    User.find({"personal_info.username": new RegExp(query, "i")})
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then( users => {
        return res.status(200).json({users});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message});
    })
}

const getProfile = (req, res) => {

    let {username} = req.body;

    User.findOne({"personal_info.username": username})
    .select("-personal_info.password -google-auth -microsoft_auth -updatedAt -blogs")
    .then(user => {
        return res.status(200).json(user);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({"error": err.message});
    })

}

const changePassword = (req, res) => {
    let {currentPassword, newPassword} = req.body;
    if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"});
    }

    User.findOne({_id: req.user})
    .then((user) => {

        if(user.microsoft_auth){
            return res.status(403).json({"error": "You can't change account's password when logged in with microsoft"});
        }

        bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
            if(err){
                return res.status(500).json({"error": "Some error occured while changeing password. Please try again"});
            }

            if(!result){
                return res.status(403).json({"error": "Incorrect current password"});
            }

            bcrypt.hash(newPassword, 10, (err, hash_password) => {
                User.findOneAndUpdate({_id: req.user}, {"personal_info.password": hash_password})
                .then((u) => {
                    return res.status(200).json({"message": "Password changed successfully"});
                })
                .catch(err => {
                    return res.status(500).json({"error": "Some error occured while changeing password. Please try again"});
                })
            })
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({"error": "User not found"});
    })
}

const updatePorfileImg = (req, res) => {
    let {url} = req.body;


    User.findOneAndUpdate({_id: req.user}, {"personal_info.profile_img": url})
    .then(() => {
        return res.status(200).json({profile_img: url});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message});
    })
}

const updateProfile = (req, res) => {
    let {username, bio, social_links} = req.body;

    let bioLimit = 200;

    if(username.length < 3){
        return res.status(403).json({"error": "Username must be at least 3 characters long."})
    }

    if(bio.length > bioLimit){
        return res.status(403).json({"error": `Bio must be less than ${bioLimit} characters long.`})
    }

    let socialLinksArr = Object.keys(social_links);

    try{

        for(let i = 0; i < socialLinksArr.length; i++){
            if(social_links[socialLinksArr[i]].length){
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                if(!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website'){
                    return res.status(403).json({"error": `${socialLinksArr[i]} link is invalid. You must enter a right links`})
                }
            }
        }

    } catch(err) {
        return res.status(500).json({"error": "You must provide full social links with http(s) included."})
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    }

    User.findOneAndUpdate({_id: req.user}, updateObj, {
        runValidators: true
    })
    .then(() => {
        return res.status(200).json({username})
    })
    .catch(err => {
        if(err.code == 11000){
            return res.status(409).json({"error": "Username already taken."})
        }
        return res.status(500).json({"error": err.message})
    })

}




export {signupUser, signInUser, microsoftAuth, searchUser, getProfile, changePassword, updatePorfileImg, updateProfile}