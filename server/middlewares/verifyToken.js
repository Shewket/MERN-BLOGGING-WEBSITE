import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {
        return res.status(401).json({error: "No access token"})
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if(err){
            return res.status(403).json({error: "Invalid token"});
        }

        req.user = user.id;
        req.admin = user.admin;

        next()
    })

}

export default verifyToken;