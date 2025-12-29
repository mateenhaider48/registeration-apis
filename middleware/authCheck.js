const express = require('express');
const jwt  = require('jsonwebtoken');

const authCheck = async(req,res,next)=>{
      
    const authHeader = req.headers.authorization;

    if(!authHeader){

        return res.status(401).json({
            message:"Athorization header missing"
        })
    }

    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message:"Invalid token format"
        })
    }
    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        
        next();
    } catch (error) {
        
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
             return res.status(401).json({
                message:"No refresh token"
            })
        }
        
        try {

            const decode = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);

            const newToken = jwt.sign({
                id:decode.id,
                role:decode.role
            },process.env.JWT_SECRET,{
                expiresIn:"15min"
            })
            res.setHeader("x-access-token", newToken);
            req.user = decode;

            next();
        } catch (error) {

            return res.status(403).json({
                message:"Refresh token expired or invalid"
            })
        }
       
    }
    

}


const authorized = (...authorizedRoles)=>{

    return (req,res,next)=>{

        const role = req.user?.role

        if(!authorizedRoles.includes(role)){
            return res.status(403).json({
                message:"Forbidden: Access denied!"
            })
        }
            next();
    }
}

module.exports = {authCheck, authorized};